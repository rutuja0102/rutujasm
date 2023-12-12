'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class seva extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  seva.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    tagline: DataTypes.STRING,
    sevaScheduleType: DataTypes.STRING,
    fixedScheduleType: DataTypes.STRING,
    fixedDaysData: DataTypes.STRING,
    variableDatesData: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'seva',
  });
  return seva;
};