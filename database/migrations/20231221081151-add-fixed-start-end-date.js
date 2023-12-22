'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sevas', 'fixed_start_date', {
      type: Sequelize.STRING,
      allowNull: true,
      field: "fixed_start_date"
    });

    await queryInterface.addColumn('sevas', 'fixed_end_date', {
      type: Sequelize.STRING,
      allowNull: true,
      field: "fixed_end_date"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sevas', 'fixed_start_date');
    await queryInterface.removeColumn('sevas', 'fixed_end_date');
  },
};