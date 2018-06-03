import React, {Component} from 'react';
import { Rate } from 'antd';

class Rating extends Component {
	state = {
		value: 3,
	}

	handleChange = (value) => {
		this.setState({ value });
		console.log(value);
	}

	render(){
		return (
			<Rate onChange={this.handleChange} value={this.state.value} />
		)
	}
}

export default Rating