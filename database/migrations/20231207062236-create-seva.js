"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sevas", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, 
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tagline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sevaScheduleType: {
        type: Sequelize.ENUM("fixed", "variable"),
        allowNull: true,
        field: "seva_schedule_type",
        
      },
      fixedScheduleType: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING,
        allowNull: true,
        field: "fixed_days_data",
      },
      variableDatesData: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "variable_dates_data",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sevas");
  },
};