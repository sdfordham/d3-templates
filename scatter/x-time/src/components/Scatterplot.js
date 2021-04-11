import React from 'react';
import d3Scatterplot from './d3Scatterplot.js';

class ScatterPlot extends React.Component {
    componentDidMount() {
        d3Scatterplot.create(
            this._rootNode,
            this.props.points,
            this.props.configuration
        );
    }

    componentDidUpdate(){
        d3Scatterplot.update(
            this._rootNode,
            this.props.points
        );
    }

    _setRef(componentNode) {
        this._rootNode = componentNode;
    }
        
    render() {
        return (
            <div
            className="scatter-container"
            ref={this._setRef.bind(this)}
            />
        )
    }
};

export default ScatterPlot;