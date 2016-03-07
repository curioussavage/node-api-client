import Base from './base';

class Subreddit extends Base {
  _type = 'Subreddit';

  constructor(props) {
    delete props.submit_text_html;
    delete props.description_html;
    delete props.public_description_html;

    super(props);
  }
}

export default Subreddit;
