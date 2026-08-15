import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Paid'
  },
  fullName: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  zipCode: {
    type: DataTypes.STRING
  },
  paymentId: {
    type: DataTypes.STRING
  },
  _id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('id') || this.id;
    }
  }
}, {
  timestamps: true
});

export default Order;
