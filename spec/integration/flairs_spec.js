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
          });
      });

      // describe("GET /topics/:topicId/flairs/:id", () => {
      //   it("should render a view with the selected flair", done => {
      //     request.get(
      //       `${base}/${this.topic.id}/flairs/${this.flair.id}`,
      //       (err, res, body) => {
      //         expect(err).toBeNull();
      //         expect(body).toContain("sports");
      //         done();
      //       }
      //     );
      //   });
      // });

      describe("#getFlairs", () => {
        it("should return flairs associated with a particular topic", done => {
          this.topic.getFlairs()
          .then((associatedFlairs) => {
            expect(associatedFlairs[0]).not.toBeNull();
            expect(associatedFlairs[0].name).toBe("sports");
            expect(associatedFlairs[0].color).toBe("red");
            expect(associatedFlairs[0].topicId).toBe(this.topic.id);
            done();
          })
          .catch((err) => {
            console.log(err);
          });
        });
      });

      describe("POST /topics/:topicId/flairs/:id/destroy", () => {
        it("should delete the flair with the associated ID", done => {
          expect(this.flair.id).toBe(1);
          request.post(
            `${base}/${this.topic.id}/flairs/${this.flair.id}/destroy`,
            (err, res, body) => {
              Flair.findById(1).then(flair => {
                expect(err).toBeNull();
                expect(flair).toBeNull();
                done();
              });
            }
          );
        });
      });

});