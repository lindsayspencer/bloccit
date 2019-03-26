const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;

describe('Topic', () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.user;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: 'starman@tesla.com',
        password: 'Trekkie4lyfe'
      }).then(user => {
        this.user = user;
        Topic.create(
          {
            title: 'Expeditions to Alpha Centauri',
            description:
              'A compilation of reports from recent visits to the star system.',
            posts: [
              {
                title: 'My first visit to Proxima Centauri b',
                body: 'I saw some rocks.',
                userId: this.user.id
              }
            ]
          },
          {
            include: {
              model: Post,
              as: 'posts'
            }
          }
        ).then(topic => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        });
      });
    });
  });

  describe('#create()', () => {
    it('should create a topic object with a title, description, and assigned posts', done => {
      Topic.create({
        title: 'Science Haven',
        description: 'A place to discuss all things science'
      })
        .then(topic => {
          expect(topic.title).toBe('Science Haven');
          expect(topic.description).toBe(
            'A place to discuss all things science'
          );
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it('should not create a topic with missing title and description', done => {
      Topic.create({
        title: 'Science Haven'
      })
        .then(topic => {
          // the code in this block will not be evaluated since the validation error
          // will skip it. Instead, we'll catch the error in the catch block below
          // and set the expectations there

          done();
        })
        .catch(err => {
          expect(err.message).toContain('Topic.description cannot be null');
          done();
        });
    });
  });
  describe('#setTopic()', () => {
    it('should associate a topic and a post together', done => {
      Topic.create({
        title: 'Challenges of interstellar travel',
        description: '1. The Wi-Fi is terrible'
      }).then(newTopic => {
        expect(this.post.topicId).toBe(this.topic.id);
        this.post.setTopic(newTopic).then(post => {
          expect(post.topicId).toBe(newTopic.id);
          done();
        });
      });
    });
  });
  describe('#getPosts()', () => {
    it('should return the associated posts', done => {
      this.topic.getPosts().then(posts => {
        expect(posts[0].title).toBe('My first visit to Proxima Centauri b');
        done();
      });
    });
  });
});