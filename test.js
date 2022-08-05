const tape = require("tape");
const jsonist = require("jsonist");

const port = (process.env.PORT =
  process.env.PORT || require("get-port-sync")());
const endpoint = `http://localhost:${port}`;

const server = require("./server");

tape("health", async function (t) {
  const url = `${endpoint}/health`;
  try {
    const { data, response } = await jsonist.get(url);
    if (response.statusCode !== 200) {
      throw new Error(
        "Error connecting to sqlite database; did you initialize it by running `npm run init-db`?"
      );
    }
    t.ok(data.success, "should have successful healthcheck");
    t.end();
  } catch (e) {
    t.error(e);
  }
});

tape("getStudent", async function (t) {
  const url = `${endpoint}/student/2`;
  try {
    const { data, response } = await jsonist.get(url);
    if (response.statusCode !== 200) {
      throw new Error(
        "Error in retriving student data from api call , please check db connection or api code?"
      );
    }
    if (response.statusCode == 200) {
      t.equal(data.studentData.id, 2, "should have student id 2");
    }
    t.pass("getStudent works fine");
    t.end();
  } catch (e) {
    t.error(e);
  }
});

tape("getStudentGradesReport", async function (t) {
  const url = `${endpoint}/student/2/grades`;
  try {
    const { data, response } = await jsonist.get(url);
    if (response.statusCode !== 200) {
      throw new Error(
        "Error in retriving student grades data from api call , please check db connection or api code?"
      );
    }
    if (response.statusCode == 200) {
      t.equal(data.studentDetails.id, 2, "should have 2 grades");
      data.studentGrades.forEach(element => {
        t.equal(element.id.id, 2, "should have 2 grades");
        
      });
   

    }
    t.pass("getStudentGradesReport works fine");
    t.end();
  } catch (e) {
    t.error(e);
  }
})

tape("getCourseGradesReport", async function (t) {
  const url = `${endpoint}/course/all/grades`;
  try {
    const { data, response } = await jsonist.get(url);
    if (response.statusCode !== 200) {
      throw new Error(
        "Error in retriving course grades data from api call , please check db connection or api code?"
      );
    }
    if (response.statusCode == 200) {
      t.pass("getCourseGradesReport works fine");
    }
   
    t.end();
  } catch (e) {
    t.error(e);
  }
})

tape("cleanup", function (t) {
  server.closeDB();
  server.close();
  t.end();
});
