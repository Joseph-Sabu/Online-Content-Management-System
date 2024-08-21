const mongoose = require('mongoose');
const UserModel = require('./models/account');

mongoose.connect('mongodb://localhost:27017/blogCMS');

async function initializeAdmin() {
    try {
        const adminUsername = 'admin'; 
        const adminPassword = 'password';

        const userExists = await UserModel.findOne({ username: adminUsername });
        if (userExists) {
            console.log('Admin user already exists');
            return;
        }

        const newAdmin = new UserModel({ username: adminUsername, password: adminPassword });
        await newAdmin.save();

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error initializing admin user:', error);
    } finally {
        mongoose.connection.close();
    }
}

initializeAdmin();
