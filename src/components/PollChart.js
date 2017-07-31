import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Chart from 'chart.js';


const chartOptions = {
    scales: {
        yAxes: [{
            ticks: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'},
            maxBarThickness: 30
        }],
        xAxes: [{
            ticks: {
                min: 0,
                fixedStepSize: 1,
            }
        }]
    },
    legend: {
        display: false
    }
};


const barBackgroundColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
];


const barBorderColors = [
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
];

class PollChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chart: null
        };
    }

    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this);
        const ctx = canvas.getContext('2d');
        const data = {
            labels: this.props.labels,
            datasets: [{
                data: [0, 0],
                backgroundColor: barBackgroundColors,
                borderColor: barBorderColors,
                borderWidth: 1
            }]
        };

        this.setState({
            chart: new Chart(ctx, {
                type: 'horizontalBar',
                data: data,
                options: chartOptions
            })
        });
    }

    render() {
        return (
            <canvas width={this.props.width} height={this.props.height}></canvas>
        );
    }
}

PollChart.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
};

PollChart.defaultProps = {
    width: 300,
    height: 100
};


export default PollChart;
