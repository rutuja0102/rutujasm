const express = require("express");
const router = express.Router();
const sevas = require("../../database/models").seva;

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
        return res.status(400).json({ message: requiredFields[field] });
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
    console.log("error: ",error)
    return res.status(500).json(error);
  }
});

router.post("/updateSeva/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fixedScheduleType, fixedDaysData } = req.body;
    console.log("BOdy: ", fixedScheduleType);
    const foundSeva = await sevas.findByPk(id);
    if (!foundSeva) {
      return res.status(404).json({ message: "Seva not found" });
    }
    foundSeva.fixedScheduleType = fixedScheduleType;
    foundSeva.fixedDaysData = fixedDaysData;
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
      .status(200)
      .json({ message: "Seva updated successfully", updatedSeva: foundSeva });
  } catch (error) {
    res.status(500).json({ message: "Error updating Seva" });
  }
});

router.post("/updateVariableSevaCalendar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { variableDatesData } = req.body;
    console.log(variableDatesData);
    const foundSeva = await sevas.findByPk(id);
    if (!foundSeva) {
      return res.status(404).json({ message: "Seva not found" });
    }

    foundSeva.variableDatesData = variableDatesData;

    await sevas.update(foundSeva, {
      where: {
        id,
      },
    });

    await foundSeva.save();

    res
      .status(200)
      .json({ message: "Seva updated successfully", updatedSeva: foundSeva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Seva" });
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

module.exports = router;
