const User = require('../models/User');

// Obtiene todos los usuarios (con paginación y filtrado)
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, filter } = req.query;

    const query = filter ? { 
      $or: [
        { name: { $regex: filter, $options: 'i' } },
        { email: { $regex: filter, $options: 'i' } }
      ] 
    } : {};

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({ 
      data: users, 
      currentPage: parseInt(page), 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtiene un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crea un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualiza un usuario
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { name, email, password, role }, 
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Elimina un usuario
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};