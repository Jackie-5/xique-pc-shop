/**
 * Created by JackieWu on 2018/7/15.
 */
import React from 'react';
import Button from 'antd/lib/button'
import './index.less';

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="index-app">
        <Button type="primary">Primary</Button>
      </div>
    )
  }
}

export default Index;
