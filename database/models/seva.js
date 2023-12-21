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
    sevaScheduleType: {
      type: DataTypes.ENUM("fixed", "variable"),
      allowNull: true,   
      field: "seva_schedule_type",
    },
    fixedScheduleType: {
      type: DataTypes.ENUM(
        "Weekly",
        "Every 2 weeks",
        "Every 3 weeks",
        "Every 4 weeks",
        "Does not repeat"
      ),
      allowNull: true,
      field: "fixed_schedule_type",
    },
    fixedDaysData: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "fixed_days_data",
    },
    fixedStartDate: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "fixed_start_date",
    },
    fixedEndDate: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "fixed_end_date",
    },
    variableDatesData: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "variable_dates_data",
    },
  }, {
    sequelize,
    modelName: 'seva',
  });
  return seva;
};