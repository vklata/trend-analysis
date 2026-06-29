const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and Password are required"
      });
    }

    const sql = `
      SELECT
        UserId,
        UserName,
        TenantId
      FROM userdetail
      WHERE UserName = ?
        AND Password = ?;
    `;

    const [rows] = await db.query(sql, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password"
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: rows[0]
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

router.get("/state", async (req, res) => {
  try {
    const tenantId = Number(req.query.tenantId || 1);

    const [rows] = await db.query("CALL sp_states_by_tenant(?)", [tenantId]);

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/branches/:state", async (req, res) => {
  try {
    const tenantId = Number(req.query.tenantId || 1);

    const state = req.params.state;

    const [rows] = await db.query("CALL sp_branches_by_state(?,?)", [
      tenantId,
      state,
    ]);

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/overview-kpis", async (req, res) => {
  try {
    const { tenantId, session, state, schoolId } = req.query;

    const [rows] = await db.query("CALL sp_overview_kpis(?,?,?,?)", [
      Number(tenantId || 1),
      session,
      state || "All States",
      schoolId || "all",
    ]);

    return res.json(rows[0][0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/overview-enrollment", async (req, res) => {
  try {
    const { tenantId, session, state, schoolId } = req.query;

    const [rows] = await db.query("CALL sp_overview_enrollment(?,?,?,?)", [
      Number(tenantId || 1),
      session,
      state || "All States",
      schoolId || "all",
    ]);

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/overview-enrollment-compare", async (req, res) => {
  try {
    const { tenantId, state, schoolId } = req.query;

    const [rows] = await db.query(
      "CALL sp_overview_enrollment_compare(?,?,?)",
      [Number(tenantId || 1), state || "All States", schoolId || "all"],
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/overview-state-fee", async (req, res) => {
  try {
    const { tenantId, session, state, schoolId } = req.query;

    const [rows] = await db.query("CALL sp_overview_state_fee(?,?,?,?)", [
      Number(tenantId || 1),
      session,
      state || "All States",
      schoolId || "all",
    ]);

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/overview-module-adoption", async (req, res) => {
  try {
    const { tenantId, session, state, schoolId } = req.query;

    const [rows] = await db.query("CALL sp_overview_module_adoption(?,?,?,?)", [
      Number(tenantId || 1),
      session,
      state || "All States",
      schoolId || "all",
    ]);

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/fee-kpis", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_fee_kpis(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 1,
    ]);

    res.json(rows[0][0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/fee-monthly-collection", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_fee_monthly_collection(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 1,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/fee-quarterly", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_fee_quarterly(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 1,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/payment-mode-split", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_payment_mode_split(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 1,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/outstanding-aging", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId, compare } = req.query;

    const [rows] = await db.query("CALL sp_outstanding_aging(?,?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 1,
      compare === "true",
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/fee-branch-summary", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_fee_branch_summary(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 1,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get('/exam-kpi', async (req, res) => {
  try {

    const {
      session,
      state,
      schoolId,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_exam_kpi(?,?,?,?)',
      [
        session,
        state || 'All States',
        schoolId || 'all',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0][0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});


router.get('/exam-subject-scores', async (req, res) => {
  try {

    const {
      state,
      schoolId,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_exam_subject_scores(?,?,?)',
      [
        state || 'All States',
        schoolId || 'all',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});


router.get('/exam-grade-distribution', async (req, res) => {
  try {

    const {
      session,
      state,
      schoolId,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_exam_grade_distribution(?,?,?,?)',
      [
        session,
        state || 'All States',
        schoolId || 'all',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get('/exam-class-passrate', async (req, res) => {
  try {

    const {
      session,
      state,
      schoolId,
      compare,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_exam_class_passrate(?,?,?,?,?)',
      [
        session,
        state || 'All States',
        schoolId || 'all',
        compare === 'true',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get('/exam-term-trend', async (req, res) => {
  try {

    const {
      session,
      state,
      schoolId,
      compare,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_exam_term_trend(?,?,?,?,?)',
      [
        session,
        state || 'All States',
        schoolId || 'all',
        compare === 'true',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get('/attendance-summary', async (req, res) => {
  try {

    const {
      session,
      state,
      schoolId,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_attendance_summary(?,?,?,?)',
      [
        session,
        state || 'All States',
        schoolId || 'all',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0][0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get('/attendance-monthly-trend', async (req, res) => {
  try {

    const {
      session,
      state,
      schoolId,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_attendance_monthly_trend(?,?,?,?)',
      [
        session,
        state || 'All States',
        schoolId || 'all',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get('/attendance-daywise', async (req, res) => {
  try {

    const {
      session,
      state,
      schoolId,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_attendance_daywise(?,?,?,?)',
      [
        session,
        state || 'All States',
        schoolId || 'all',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get('/attendance-bands', async (req, res) => {
  try {

    const {
      session,
      state,
      schoolId,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_attendance_bands(?,?,?,?)',
      [
        session,
        state || 'All States',
        schoolId || 'all',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get('/attendance-branches', async (req, res) => {
  try {

    const {
      state,
      tenantId
    } = req.query;

    const [rows] = await db.query(
      'CALL sp_branches(?,?)',
      [
        state || 'All States',
        Number(tenantId || 1)
      ]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get('/attendance-states', async (req, res) => {
  try {

    const tenantId =
      Number(req.query.tenantId || 1);

    const [rows] = await db.query(
      'CALL sp_state(?)',
      [tenantId]
    );

    return res.json(rows[0]);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

router.get("/budget-summary", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_budget_summary(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 0,
    ]);

    res.json(rows[0][0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/budget-monthly-trend", async (req, res) => {
  try {
    const { state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_budget_monthly_trend(?,?,?)", [
      state || "All States",
      schoolId || "all",
      tenantId || 0,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/income-breakdown", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_income_breakdown(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 0,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/expense-breakdown", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_expense_breakdown(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 0,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/budget-expense-trend", async (req, res) => {
  try {
    const { session,state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_budget_expense_trend(?,?,?,?)", [
        session,
      state || "All States",
      schoolId || "all",
      tenantId || 0,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/budget-headwise", async (req, res) => {
  try {
    const { session, state, schoolId, tenantId } = req.query;

    const [rows] = await db.query("CALL sp_budget_headwise(?,?,?,?)", [
      session,
      state || "All States",
      schoolId || "all",
      tenantId || 0,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/c-branch-directory", async (req, res) => {
  try {
    const tenantId = Number(req.query.tenantId || 1);

    const [rows] = await db.query("CALL sp_branch_directory(?)", [tenantId]);

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
