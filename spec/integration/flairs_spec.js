const request = require("request");
const server = require("../../src/server.js");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
    beforeEach(done => {
        this.topic;
        this.flair;
    
        sequelize.sync({ force: true }).then(res => {
          Topic.create({
            title: "Winter Games",
            description: "Post your Winter Games stories."
          })
            .then(topic => {
              this.topic = topic;
    
              Flair.create({
                name: "sports",
                color: "red",
                topicId: this.topic.id
              }).then(flair => {
                this.flair = flair;
                done();
              });
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });

      describe("GET /topics/:topicId/flairs/new", () => {
        it("should render a new flair form to tag a topic", done => {
          request.get(`${base}/${this.topic.id}/flairs/new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Tag");
            done();
          });
        });
      });

      describe("POST /topics/:topicId/flairs/create", () => {
          it("should create a new flair and redirect to the associated topic", done => {
            const options = {
                url: `${base}/${this.topic.id}/flairs/create`,
                form: {
                  name: "books",
                  color: "pink"
                }
              };
              request.post(options, (err, res, body) => {
                Flair.findOne({ where: { name: "books" } })
                  .then(flair => {
                    //console.log(flair);
                    expect(flair).not.toBeNull();
                    expect(flair.name).toBe("books");
                    expect(flair.color).toBe("pink");
                    expect(flair.topicId).not.toBeNull();
                    done();
                  })
                  .catch(err => {
                    console.log(err);
                    done();
                  });
              });
          })
      })
});