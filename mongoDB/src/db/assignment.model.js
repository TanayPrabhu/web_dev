const { connectMongo, getAssignmentCollection } = require('./connection');

// Helper functions for CRUD operations on the 'assignment' collection
async function createAssignment(data) {
  await connectMongo();
  const collection = getAssignmentCollection();
  data.submitted_at = data.submitted_at || new Date();
  return collection.insertOne(data);
}

async function getAssignments(query = {}) {
  await connectMongo();
  const collection = getAssignmentCollection();
  return collection.find(query).toArray();
}

async function getAssignmentById(id) {
  await connectMongo();
  const collection = getAssignmentCollection();
  const { ObjectId } = require('mongodb');
  return collection.findOne({ _id: new ObjectId(id) });
}

async function updateAssignment(id, update) {
  await connectMongo();
  const collection = getAssignmentCollection();
  const { ObjectId } = require('mongodb');
  return collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
}

async function deleteAssignment(id) {
  await connectMongo();
  const collection = getAssignmentCollection();
  const { ObjectId } = require('mongodb');
  return collection.deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
};
