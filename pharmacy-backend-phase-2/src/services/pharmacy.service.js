const model = require("../models/pharmacy.model");

async function createPharmacy(data) {
  return model.createPharmacy(data);
}

async function listPharmacies() {
  return model.listPharmacies();
}

async function getPharmacy(id) {
  const pharmacy = await model.getPharmacyById(id);
  if (!pharmacy) {
    const error = new Error("Pharmacy not found.");
    error.statusCode = 404;
    throw error;
  }
  return pharmacy;
}

async function addStaff(pharmacyId, data) {
  await getPharmacy(pharmacyId);
  return model.addStaff(pharmacyId, data);
}

async function listStaff(pharmacyId) {
  await getPharmacy(pharmacyId);
  return model.listStaff(pharmacyId);
}

module.exports = { createPharmacy, listPharmacies, getPharmacy, addStaff, listStaff };
