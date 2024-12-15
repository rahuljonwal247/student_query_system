
const { Query, User } = require("../models");
const { sendNotification } = require("../utils/socket");

let resolverIndex = 0; // Keeps track of the round-robin assignment
let investigationIndex = 0;

exports.createQuery = async (req, res) => {
  try {
    const { title, description } = req.body;
    const attachment = req.file?.path;

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
      resolverId: assignedResolver.id,
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
      queries = await Query.findAll({
        where: { studentId: req.user.id },
        include: [
          {
            model: User,
            as: "student", // Alias for the association
            attributes: ["id", "name"], // Select only necessary fields
          },
          {
            model: User,
            as: "resolver", // Alias for the association
            attributes: ["id", "name"],
          },
        ],
      });
    } else if (req.user.role === "resolver") {
      queries = await Query.findAll({
        where: { resolverId: req.user.id },
        include: [
          {
            model: User,
            as: "student",
            attributes: ["id", "name"],
          },
          {
            model: User,
            as: "resolver",
            attributes: ["id", "name"],
          },
        ],
      });
    } else if (req.user.role === "investigator") {
      queries = await Query.findAll({
        where: { investigationId: req.user.id },
        include: [
          {
            model: User,
            as: "student",
            attributes: ["id", "name"],
          },
          {
            model: User,
            as: "resolver",
            attributes: ["id", "name"],
          },
        ],
      });
    } else if (req.user.role === "admin") {
      // Fetch all queries for admins
      queries = await Query.findAll({
        include: [
          {
            model: User,
            as: "student",
            attributes: ["id", "name"],
          },
          {
            model: User,
            as: "resolver",
            attributes: ["id", "name"],
          },
        ],
      });
    }
    else {
      return res.status(403).json({ error: "Access denied" });
    }
      
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.getQuery = async (req, res) => {
  try {
    const { id } = req.params;

    let query;

    if (req.user.role === "student") {
      query = await Query.findOne({ where: { id, studentId: req.user.id } });
    } else if (req.user.role === "resolver") {
      query = await Query.findOne({ where: { id, resolverId: req.user.id } });
    }else if (req.user.role === "investigator") {
      query = await Query.findOne({ where: { id, investigationId: req.user.id } });
    }
     else {
      return res.status(403).json({ error: "Access denied" });
    }
    

    if (!query) {
      return res.status(404).json({ error: "Query not found" });
    }

    res.json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, resolutionSummary } = req.body;

    const query = await Query.findByPk(id);
    if (!query) return res.status(404).json({ error: "Query not found" });

    if (req.user.role === "resolver" && query.resolverId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    

    if (status) query.status = status;
    if (internalNotes) query.internalNotes = internalNotes;
    if (resolutionSummary) query.resolutionSummary = resolutionSummary;

    await query.save();

    sendNotification("query-updated", query);
    res.json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendToInvestigation = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findOne({
      where: { id, resolverId: req.user.id },
    });
    if (!query) return res.status(404).json({ error: "Query not found" });
    if (query.status !== "In Progress") {
      return res.status(400).json({
        error: "Only queries in 'In Progress' can be sent to investigation",
      });
    }

    // Fetch investigators from the database
    const investigations = await User.findAll({ where: { role: "investigator" } });
    if (investigations.length === 0) {
      return res.status(500).json({ error: "No investigators available" });
    }

    const assignedInvestigation = investigations[investigationIndex % investigations.length];

    query.status = "Under Investigation";
    query.investigationId = assignedInvestigation.id;
    await query.save();

    investigationIndex = (investigationIndex + 1) % investigations.length;

    res.json({ message: "Query sent to investigation", query, assignedInvestigation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await Query.findOne({
      where: { id, investigationId: req.user.id },
    });
  
    if (!query) return res.status(404).json({ error: "Query not found" });
   
    if (query.status !== "Under Investigation") {
      return res.status(400).json({
        error: "Only queries under investigation can be approved",
      });
    }
    
    query.status = "Approved";
    await query.save();

    res.json({ message: "Query approved by investigation", query });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};