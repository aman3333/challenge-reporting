const knex = require("./db");
let studentgradesData = require("./grades.json");

async function getHealth(req, res, next) {
  try {
    await knex("students").first();
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getStudent(req, res, next) {
  try {
    let data = await knex("students").where({
      id: req.params.id,
    });
    if (data.length) res.json({ studentData: data[0] });
    else res.status(404).send("Student not found");
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getStudentGradesReport(req, res, next) {
  let studentCourses = [];
  const filterCourseGrades = (init, length, cb) => {
    setImmediate(function () {
      if (init >= length) {
        cb();

        return;
      }

      for (let i = init; i < init + 1000 && i < length; i++) {
        if (studentgradesData[i].id == req.params.id) {
          studentCourses.push(studentgradesData[i]);
        }
      }

      filterCourseGrades(init + 1000, length, cb);
    });
  };
  try {
    let data = await knex("students").where({
      id: req.params.id,
    });
    if (data.length) {
      filterCourseGrades(0, studentgradesData.length, () => {
        res
          .status(200)
          .json({ studentGrades: studentCourses, studentDetails: data[0] });
      });
    } else {
      res.status(404).send("Student not found");
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getCourseGradesReport(req, res, next) {
  let courseObject = {};
  const itterateCourseGrades = (init, length, cb) => {
    setImmediate(function () {
      if (init >= length) {
        cb();

        return;
      }

      for (let i = init; i < init + 1000 && i < length; i++) {
        let course = studentgradesData[i].course;
        let grade = studentgradesData[i].grade;
        if (courseObject[course]) {
          courseObject[course].numofstudents =
            courseObject[course].numofstudents + 1;
          courseObject[course].totalMarks += grade;
          (courseObject[course].heighest =
            courseObject[course].heighest > grade
              ? courseObject[course].heighest
              : grade),
            (courseObject[course].lowest =
              courseObject[course].lowest < grade
                ? courseObject[course].lowest
                : grade);
        } else {
          courseObject[course] = {
            course: course,
            numofstudents: 1,
            totalMarks: grade,
            heighest: grade,
            lowest: grade,
          };
        }
      }

      itterateCourseGrades(init + 1000, length, cb);
    });
  };

  try {
    itterateCourseGrades(0, studentgradesData.length, () => {
      let formatedResponse = Object.values(courseObject).map((item) => {
        return {
          course: item.course,
          avgGrade: (item.totalMarks / item.numofstudents).toFixed(2),
          heighest: item.heighest,
          lowest: item.lowest,
        };
      });
      res.status(200).json({ courseGradesReport: formatedResponse });
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport,
};
