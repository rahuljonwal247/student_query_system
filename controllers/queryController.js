const { Query, User } = require("../models");
const { sendNotification } = require("../utils/socket");


let resolverIndex = 0; // Keeps track of the round-robin assignment

exports.createQuery = async (req, res) => {
  try {
    const { title, description } = req.body;
    const attachment = req.file?.path;
    console.log("req.body",req.body)
    // Fetch resolvers from the database
    const resolvers = await User.findAll({ where: { role: "resolver" } });
    if (resolvers.length === 0) {
      return res.status(500).json({ error: "No resolvers available" });
    }

    // Assign to a resolver in round-robin fashion
    const assignedResolver = resolvers[resolverIndex % resolvers.length];
    resolverIndex++;

    const query = await Query.create({
      title,
      description,
      attachment,
      status: "Pending",
      studentId: req.user.id,
      resolverId: assignedResolver.id, // Assign the resolver
    });

    sendNotification("new-query", query); // Notify assigned resolver
    res.status(201).json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getQueries = async (req, res) => {
  try {
    let queries;

    if (req.user.role === "student") {
      // Students can only view their queries
      queries = await Query.findAll({ where: { studentId: req.user.id } });
    } else if (req.user.role === "resolver") {
      // Resolvers can only view their assigned queries
      queries = await Query.findAll({ where: { resolverId: req.user.id } });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getQuery = async (req, res) => {
  try {
    const { id } = req.params; // Extract query ID from URL parameter

    let query;

    // If the user is a student, only their queries can be retrieved
    if (req.user.role === "student") {
      query = await Query.findOne({
        where: { id, studentId: req.user.id }, // Ensure query belongs to the student
      });
    } 
    // If the user is a resolver, only the queries assigned to them can be retrieved
    else if (req.user.role === "resolver") {
      query = await Query.findOne({
        where: { id, resolverId: req.user.id }, // Ensure query is assigned to the resolver
      });
    } 
    else {
      return res.status(403).json({ error: "Access denied" }); // If role is neither student nor resolver
    }

    if (!query) {
      return res.status(404).json({ error: "Query not found" }); // If query doesn't exist for the user
    }

    res.json(query); // Return the found query
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle any errors
  }
};


exports.updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, resolutionSummary } = req.body;

    const query = await Query.findByPk(id);
    if (!query) return res.status(404).json({ error: "Query not found" });

    // Ensure resolver is modifying only assigned queries
    if (req.user.role === "resolver" && query.resolverId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update fields
    if (status) query.status = status;
    if (internalNotes) query.internalNotes = internalNotes;
    if (resolutionSummary) query.resolutionSummary = resolutionSummary;

    await query.save();

    sendNotification("query-updated", query); // Notify students
    res.json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
