import express from "express";
import authorization from "../middleware/authorization.js";
import db from "../db.js";

const router = express.Router();

router.post("/", authorization, async (req, res) => {
  const token = req.header("token");
  console.log("token", token);
  try {
    // const authUser = await db.query("SELECT user FROM users WHERE user_id = $1", [req.user]);
    const user_id = req.user;
    const {
      title,
      description,
      closingDate,
      submitText,
      color,
      fields,
      completionMessage,
    } = req.body;

    const formResult = await db.query(
      "INSERT INTO forms (user_id, title, description, color, closing_date, submit_text, completion_message) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING form_id",
      [
        user_id,
        title,
        description,
        color,
        closingDate,
        submitText,
        completionMessage,
      ]
    );

    const formId = formResult.rows[0].form_id;
    console.log(formId);

    if (!formId) {
      console.log("Form not created");
      res.status(500).json("Form creation not successful");
      return;
    }

    for (let [i, field] of fields.entries()) {
      await db.query(
        `INSERT INTO form_fields (form_id, label, field_type, is_required, options, position) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          formId,
          field.label,
          field.field_type,
          field.is_required,
          field.options || null,
          i,
        ]
      );
    }

    res.status(201).json({ message: "Form created successfully", formId });
    console.log({ message: "Form created successfully", formId });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// retrieving form
router.get("/:id", async (req, res) => {
  console.log("hit");

  try {
    const formId = req.params.id;
    const form = await db.query(`SELECT * FROM forms WHERE form_id = $1`, [
      formId,
    ]);
    const fields = await db.query(
      `SELECT * FROM form_fields WHERE form_id = $1 ORDER BY position ASC`,
      [formId]
    );
    res.status(200).json({ form: form.rows[0], fields: fields.rows });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// handling form submission
router.post("/:id/submit", async (req, res) => {
  try {
    const formId = req.params.id;
    const response = req.body.response;

    await db.query(
      "INSERT INTO form_responses (form_id, response) VALUES ($1, $2);",
      [formId, response]
    );

    res.status(200).json("Submitted Successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

router.get("/:id/responses", authorization, async (req, res) => {
  const formId = req.params.id;
  let admin_id;

  try {
    const user = await db.query(
      "SELECT user_id, user_email, user_permission FROM users WHERE user_id=$1",
      [req.user]
    );
    const userInfo = user.rows[0];

    if (userInfo.user_permission !== "admin") {
      const staffEmployee = await db.query(
        "SELECT user_id from staffs where staff_email=$1",
        [userInfo.user_email]
      );
      admin_id = staffEmployee.rows[0].user_id;
    } else {
      admin_id = req.user;
    }

    const resp = await db.query(
      "SELECT * FROM form_responses WHERE form_id=$1  ORDER BY submitted_at DESC",
      [formId]
    );

    console.log("success", resp.rows);
    res.json(resp.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

router.get("/", authorization, async (req, res) => {
  let admin_id;

  try {
    const user = await db.query(
      "SELECT user_id, user_email, user_permission FROM users WHERE user_id=$1",
      [req.user]
    );
    const userInfo = user.rows[0];

    if (userInfo.user_permission !== "admin") {
      const staffEmployee = await db.query(
        "SELECT user_id from staffs where staff_email=$1",
        [userInfo.user_email]
      );
      admin_id = staffEmployee.rows[0].user_id;
    } else {
      admin_id = req.user;
    }

    const forms = await db.query(
      "SELECT * FROM forms WHERE user_id=$1  ORDER BY created_at DESC",
      [admin_id]
    );

    console.log("success", forms.rows);
    res.json(forms.rows);
  } catch (error) {
    console.error(error.message);
    res.json(error.message);
  }
});

export default router;
