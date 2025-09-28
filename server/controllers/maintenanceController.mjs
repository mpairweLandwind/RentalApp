import prisma from '../lib/prisma.mjs';


export const createMaintenance = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      type, 
      property, 
      state, 
      country, 
      city, 
      address,
      size, 
      maintenanceCharge, 
      estimatedValue, 
      yearBuilt, 
      lastRenovationDate, 
      materialsUsed, 
      condition, 
      maintenanceSchedule, 
      maintenanceHistory, 
      images 
    } = req.body.data;

    // Get user ID from the verified JWT token
    const userId = req.user.id;

    // First, get the user's email to store in the maintenance record
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Creating the maintenance record
    const maintenance = await prisma.maintenance.create({
      data: {
        name,
        description,
        type,
        property,
        state,
        country, 
        city, 
        address,
        size,
        maintenanceCharge,
        estimatedValue,
        yearBuilt,
        lastRenovationDate,
        materialsUsed,
        condition,
        maintenanceSchedule,
        maintenanceHistory,
        userEmail: user.email, // Store the email for the relation
        image: images || [], // Ensure images is an array, or default to an empty array if null
      },
      select: {
        id: true,
      },
    });

    res.send({ message: "Maintenance record created successfully", maintenance });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getAllMaintenance = async (req, res) => {
  try {
    const maintenanceRecords = await prisma.maintenance.findMany({
      include: {       
        user: {
          select: {          
            email: true,  // Include the user's email
          },
        },
      },
    });

    res.status(200).json({ maintenanceRecords });
  } catch (error) {
    console.error('Error retrieving maintenance records:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




export const getMaintenance = async (req, res) => {

  const { id } = req.params;

  // Check if the ID parameter is provided
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: req.params.id },
      include: { 
        maintenanceHistory: true ,
        user: {
          select: {            
            username: true,
            avatar: true,           
          }
        }
      },
    });
    res.status(200).json(maintenance);
    console.log(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateMaintenance = async (req, res) => {
  try {
    // Log the received data for debugging
    console.log('Received data:', req.body);

    // Get user email from the verified JWT token
    const userId = req.user.id;
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Find the maintenance record by its ID
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: req.params.id },
      select: { 
        id: true, 
        userEmail: true
      }
    });

    // Check if the maintenance record exists
    if (!maintenance) {
      return res.status(404).json({ message: 'Record not found!' });
    }

    // Verify that the current user owns this maintenance record
    if (maintenance.userEmail !== currentUser.email) {
      return res.status(403).json({ message: 'You can only update your own record!' });
    }

    // Destructure req.body to exclude nested objects and immutable fields
    const { id, maintenanceHistory, user, createdAt, ...updateData } = req.body;

    // Convert string fields to appropriate types if necessary
    if (updateData.latitude) {
      updateData.latitude = parseFloat(updateData.latitude);
    }
    if (updateData.lastRenovationDate) {
      updateData.lastRenovationDate = new Date(updateData.lastRenovationDate).toISOString();
    }
    

    if (updateData.longitude) {
      updateData.longitude = parseFloat(updateData.longitude);
    }
    if (updateData.size) {
      updateData.size = parseFloat(updateData.size);
    }
    if (updateData.estimatedValue) {
      updateData.estimatedValue = parseFloat(updateData.estimatedValue);
    }
    if (updateData.maintenanceCharge) {
      updateData.maintenanceCharge = parseFloat(updateData.maintenanceCharge);
    }
    if (updateData.yearBuilt) {
      updateData.yearBuilt = parseFloat(updateData.yearBuilt);
    }

    // Log the update data for debugging
    console.log('Update data:', updateData);

    // Update the maintenance record with the non-nested data provided
    const updatedMaintenance = await prisma.maintenance.update({
      where: { id: req.params.id },
      data: updateData,
    });
      console.log('Updated maintenance:', updatedMaintenance.id);
      console.log('Updated successfully');
    // Return the id of the updated maintenance record and a success message
    res.status(200).json({ id: updatedMaintenance.id, message: 'Updated successfully' });
    
  } catch (error) {
    // Log the error for debugging
    console.error('Error updating maintenance:', error);

    // Handle errors and return a 500 status code
    res.status(500).json({ message: error.message });
  }
};




export const deleteMaintenance = async (req, res) => {
  try {
    // Get user email from the verified JWT token
    const userId = req.user.id;
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // First, check if the maintenance record exists and belongs to the current user
    const existingMaintenance = await prisma.maintenance.findUnique({
      where: { id: req.params.id },
      select: { 
        id: true, 
        userEmail: true
      }
    });

    if (!existingMaintenance) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    // Verify that the current user owns this maintenance record
    if (existingMaintenance.userEmail !== currentUser.email) {
      return res.status(403).json({ error: 'You can only delete your own maintenance records' });
    }

    await prisma.maintenance.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: 'Maintenance deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    res.status(500).json({ message: error.message });
  }
};
