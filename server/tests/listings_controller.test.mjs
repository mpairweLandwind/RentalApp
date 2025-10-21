import { jest } from '@jest/globals';


const mockClient = {
  user: {
    findUnique: jest.fn(),
  },
  listing: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  maintenance: {
    findUnique: jest.fn(),
  },

  $connect: jest.fn(),
  $disconnect: jest.fn(),
};


// ESM mock definition
jest.unstable_mockModule('../lib/prisma.mjs', () => ({
  default: mockClient,
}));


// Import *after* mocking
const { default: prisma } = await import('../lib/prisma.mjs');
const { createListing, updateListing, deleteListing, getPropertyStatusPercentages } = await import ('../controllers/listing.controller.mjs');


// Now import the controller and the mocked prisma
describe('Listing Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      user: { id: 'user-1' },
      params: { id: 'listing-1' },
      body: { data: {} },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // create listing
  describe('createListing', () => {
    test('creates a new listing successfully', async () => {
      mockReq.body.data = {
        name: 'Nice Apartment',
        description: 'A beautiful home',
        regularPrice: 1000,
        discountPrice: 900,
        type: 'apartment',
        property: 'rental',
        status: 'available',
        country: 'UG',
        city: 'Kampala',
        address: '123 Street',
        facilities: ['wifi', 'parking'],
        images: ['house.jpg']
      };

      prisma.user.findUnique.mockResolvedValue({ email: 'test@example.com' });
      prisma.listing.create.mockResolvedValue({ id: 'listing-1' });

      await createListing(mockReq, mockRes);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { email: true }
      });

      expect(prisma.listing.create).toHaveBeenCalled();
      expect(mockRes.send).toHaveBeenCalledWith({
        message: 'Residency created successfully',
        listing: { id: 'listing-1' },
      });
    });

    test('returns 404 if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await createListing(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('handles server errors', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('DB fail'));
      await createListing(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  // update listing
  describe('updateListing', () => {
    beforeEach(() => {
      mockReq.body.data = {
        name: 'Updated Home',
        description: 'Updated description',
        regularPrice: 2000,
        discountPrice: 1800,
        type: 'villa',
        property: 'residential',
        status: 'sold',
        country: 'UG',
        city: 'Entebbe',
        address: 'New Street',
        facilities: ['pool'],
        images: ['updated.jpg'],
      };
    });

    test('updates listing successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'owner@example.com' });
      prisma.listing.findUnique.mockResolvedValue({ id: 'listing-1', userEmail: 'owner@example.com' });
      prisma.listing.update.mockResolvedValue({ id: 'listing-1', name: 'Updated Home' });

      await updateListing(mockReq, mockRes);

      expect(mockRes.send).toHaveBeenCalledWith({
        message: 'Listing updated successfully',
        listing: { id: 'listing-1', name: 'Updated Home' },
      });
    });

    test('returns 403 for unauthorized user', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'another@example.com' });
      prisma.listing.findUnique.mockResolvedValue({ id: 'listing-1', userEmail: 'owner@example.com' });

      await updateListing(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'You can only update your own listings' });
    });
  });

  // delete listing
  describe('deleteListing', () => {
    test('deletes listing successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'owner@example.com' });
      prisma.listing.findUnique.mockResolvedValue({ id: 'listing-1', userEmail: 'owner@example.com' });
      prisma.listing.delete.mockResolvedValue({ id: 'listing-1' });

      await deleteListing(mockReq, mockRes);

      expect(prisma.listing.delete).toHaveBeenCalledWith({ where: { id: 'listing-1' } });
      expect(mockRes.send).toHaveBeenCalledWith({ message: 'Listing deleted successfully' });
    });

    test('returns 403 if user not owner', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'notowner@example.com' });
      prisma.listing.findUnique.mockResolvedValue({ id: 'listing-1', userEmail: 'owner@example.com' });

      await deleteListing(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  // get property status percentages
  describe('getPropertyStatusPercentages', () => {
    test('returns correct percentages', async () => {
      prisma.listing.count.mockResolvedValue(4);
      prisma.listing.groupBy.mockResolvedValue([
        { status: 'available', _count: { status: 2 } },
        { status: 'sold', _count: { status: 2 } },
      ]);

      await getPropertyStatusPercentages(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([
        { name: 'available', percentValues: 50 },
        { name: 'sold', percentValues: 50 },
      ]);
    });

    test('handles error', async () => {
      prisma.listing.count.mockRejectedValue(new Error('fail'));
      await getPropertyStatusPercentages(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Failed to fetch data.');
    });
  });
});
