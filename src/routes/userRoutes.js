const express = require("express");
const router = express.Router();
const sevas = require("../../database/models").seva;
const { Sequelize } = require('sequelize');
const { sequelize } = require("../../database/models");

router.post("/createBasicSevaInfo", async (req, res) => {
  try {
    const { sevaName, sevaDescription, sevaPrice, sevaScheduleType } = req.body;
    const existingSeva = await sevas.findOne({ where: { name: sevaName } });
    if (existingSeva) {
      return res.status(500).json("Seva already exists");
    }
    const requiredFields = {
      sevaName: "Name is required",
      sevaDescription: "Description is required",
      sevaPrice: "Seva price is required",
      sevaScheduleType: "Seva schedule type is required",
    };
    for (const field in requiredFields) {
      if (!req.body[field]) {
        return res.status(500).json(requiredFields[field]);
      }
    }
    const newSeva = await sevas.create({
      name: sevaName,
      description: sevaDescription,
      price: sevaPrice,
      sevaScheduleType: sevaScheduleType,
    });
    res.status(201).json({ message: "Seva created successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/updateSeva/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fixedScheduleType, fixedDaysData, fixedStartDate, fixedEndDate } =
      req.body;

    const foundSeva = await sevas.findByPk(id);
    if (!foundSeva) {
      return res.status(500).json("Seva not found");
    }
    foundSeva.fixedScheduleType = fixedScheduleType;
    foundSeva.fixedDaysData = fixedDaysData;
    foundSeva.fixedStartDate = fixedStartDate;
    foundSeva.fixedEndDate = fixedEndDate;

    await sevas.update(
      foundSeva,
      {
        where: {
          id,
        },
      }
    );
    await foundSeva.save();
    res
      .status(201)
      .json({ message: "Seva updated successfully", updatedSeva: foundSeva });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/updateVariableSevaCalendar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { variableDatesData } = req.body;

    const foundSeva = await sevas.findByPk(id);
    if (!foundSeva) {
      return res.status(500).json("Seva not found");
    }

    foundSeva.variableDatesData = variableDatesData;

    await sevas.update(foundSeva, {
      where: {
        id,
      },
    });

    await foundSeva.save();

    res
      .status(201)
      .json({ message: "Seva updated successfully", updatedSeva: foundSeva });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/getAllSevaInfo", async (req, res) => {
  try {
    const allSevas = await sevas.findAll({
      attributes: ['name', 'price'], 
    });

    const sevaInfoList = allSevas.map(seva => ({
      name: seva.name,
      price: seva.price,
    }));

    res.status(200).json(sevaInfoList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving Seva information' });
  }
});

router.post("/searchSeva", async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required for search' });
    }

    const isSingleDigit = keyword.length === 1 && /^\d$/.test(keyword);

    const searchResults = await sevas.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            [Sequelize.Op.and]: [
              { name: { [Sequelize.Op.iLike]: `${keyword}%` } },
              Sequelize.literal('LENGTH(name) = 1') 
            ]
          },
          {
            [Sequelize.Op.and]: [
              { price: isSingleDigit ? { [Sequelize.Op.eq]: parseInt(keyword) } : Sequelize.literal('FALSE') },
              Sequelize.literal('LENGTH(CAST(price AS TEXT)) = 1') 
            ]
          },
          Sequelize.literal(`LOWER(CAST(price AS TEXT)) LIKE LOWER('%${keyword}%')`),
          { name: { [Sequelize.Op.iLike]: `%${keyword}%` } }, 
        ],
      },
      attributes: ['name', 'price'],
    });

    if (searchResults.length === 0) {
      return res.status(404).json({ message: 'No matches found' });
    }

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: 'Error during search' });
  }
});

router.get("/getSevaInfoById/:id", async(req, res) => {
  try{
    const {id} = req.params;

    const seva = await sevas.findByPk(id);
    if(!seva)
    {
      return res.status(404).json({ message: 'Seva not found'});      
    }
    res.status(200).json(seva);
  } 
  catch(error){
    console.error(error);
    res.status(500).json({message: 'Error retrieving Seva information'});
  }
}); 

router.put("/updateSevaInfo/:id", async (req , res) =>{
  try{
    const {id} = req.params;
    const updatedSevaData = req.body;
     
    const existingSeva = await sevas.findByPk(id);
    if(!existingSeva){
      return res.status(400).json({message: 'Seva not found'});
    }
     await existingSeva.update(updatedSevaData);
     const updatedSeva = await sevas.findByPk(id);

     res.status(200).json(updatedSeva);
  }
  catch(error){
     console.error(error);
     res.status(500).json({message: 'Error updating seva information'});
  }
});

module.exports = router;
