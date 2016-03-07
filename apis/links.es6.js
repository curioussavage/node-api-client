import BaseAPI from './baseContent.es6.js';
import Link from '../models/link.es6.js';

class Links extends BaseAPI {
  // TODO set cache rules
  static dataCacheConfig = {
    idProperty: 'name',
    cache: {
      max: 100,
      maxAge: 1000 * 60 * 5,
    },
  };

  get requestCacheRules () {
    return {
      ...super.requestCacheRules,
      cache: {
        max: 5,
        maxAge: 1000 * 60 * 5,
      },
    };
  }

  model = Link;

  getPath (query) {
    if (query.user) {
      return `/user/${query.user}/submitted.json`;
    } else if (query.id) {
      return `/by_id/${query.id}.json`;
    } else if (query.query.ids) {
      return `/by_id/${query.query.ids.join(',')}.json`;
    } else if (query.query.subredditName) {
      return `/r/${query.subredditName}`;
    } else if (query.query.multi) {
      return `/user/${query.multiUser}/m/${query.multi}`;
    }

    return `/${query.sort}.json`;
  }

  postPath () {
    return 'api/submit';
  }

  post (data) {
    const postData = {
      api_type: 'data',
      thing_id: data.thingId,
      title: data.title,
      kind: data.kind,
      sendreplies: data.sendreplies,
      sr: data.sr,
      iden: data.iden,
      captcha: data.captcha,
      resubmit: data.resubmit,
    };

    if (data.text) {
      postData.text = data.text;
    } else if (data.url) {
      postData.url = data.url;
    }

    super.post(postData);
  }

  formatBody(res, req) {
    const { body } = res;

    if (req.method === 'GET') {
      const data = body.data.children;

      if (body.data && body.data.children && body.data.children[0]) {
        if (data.length === 1) {
          return new Link(data[0].data).toJSON();
        } else {
          return data.map(c => new Link(c.data).toJSON());
        }
      } else if (data) {
        return [];
      }
    } else {
      if (body.json && body.json.errors.length === 0) {
        return body.json.data;
      } else {
        throw body.json;
      }
    }
  }
}

export default Links;
