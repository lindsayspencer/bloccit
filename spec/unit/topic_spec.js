const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

// create method, when calling Topic.create a topic object is created and stored in the db 
// getPosts method, create and associate a post with the topic in scope
// getPosts returns an array of Post objects associated with the topic the method was called on
// test should confirm that the associated post is returned 

describe("Topic", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        sequelize.sync({force: true}).then((res) => {
          Topic.create({
            title: "Expeditions to Alpha Centauri",
            description: "A compilation of reports from recent visits to the star system."
          })
          .then((topic) => {
            this.topic = topic;
            Post.create({
              title: "My first visit to Proxima Centauri b",
              body: "I saw some rocks.",
              topicId: this.topic.id
            })
            .then((post) => {
              this.post = post;
              done();
            });
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
    
      });

    describe("#create", () => {
        it("should create a topic object with a title and description", (done) => {
            Topic.create({
                title: "Topic one",
                description: "Topic one description"
            })
            .then((topic) => {
                expect(topic.title).toBe("Topic one");
                expect(topic.description).toBe("Topic one description");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        });
    });

    describe("#getPosts", () => {
        it("should return an array of post objects that are associated with a specified topic", (done) => {
            this.topic.getPosts()
            .then((associatedPosts) => {
                expect(associatedPosts[0].title).toContain("visit");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });
});
