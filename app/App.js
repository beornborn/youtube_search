import React, {Component} from 'react';
import {render} from 'react-dom';
import AppBar from 'material-ui/lib/app-bar';
import AutoComplete from 'material-ui/lib/auto-complete';
import Avatar from 'material-ui/lib/avatar';
import superagent from 'superagent';
import truncate from 'truncate';

class SearchInfo extends Component {
  render() {
    const containerStyle = { fontFamily: "sans-serif", marginBottom: '10px' };
    return (
      <div style={containerStyle}>
        Search: "{this.props.query}" ({this.props.amount})
      </div>
    );
  }
}

class SongItem extends Component {
  render() {
    const titleStyle = { fontWeight: 'bold', fontSize: '12px' };
    const descriptionStyle = { fontSize: '11px' };
    const containerStyle = { width: '250px', fontFamily: "sans-serif" };
    const contentStyle = { float: 'left', marginLeft: '5px' };
    const imageStyle = { float: 'left' };

    return (
      <div style={containerStyle}>
        <Avatar src={this.props.src} size={50} style={imageStyle}/>
        <div style={contentStyle}>
          <div style={titleStyle}> {this.props.title} </div>
          <div style={descriptionStyle}> {this.props.description} </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
    };
  }

  buildSong(data) {
    let description = item.pagemap.videoobject[0].description;
    let title = truncate(item.title, 20);
    let src = item.pagemap.cse_thumbnail[0].src;
    return React.createElement(SongItem, {
      title: title,
      description: description,
      src: src
    });
  }

  handleUpdateInput = (query) => {
    const apiKey = 'AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU';
    const cx = '001598476400022559450:hq-zze35gfq';
    let url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU&cx=001598476400022559450:hq-zze35gfq&q=${query}`;
    let self = this;

    superagent.get(url).end((err, res) => {
      let data = JSON.parse(res.text);

      let items = [];
      let totalResults = data.searchInformation.totalResults;
      let info = React.createElement(SearchInfo, { query: query, amount: totalResults });
      items.push(info);

      data.items.forEach((item) => {
        let song = buildSong(item);
        items.push(song);
      });

      self.setState({
        dataSource: items,
      });
    });
  };

  render() {
    const appBarStyle = {
      backgroundColor: "#4253B2",
      fontFamily: "sans-serif"
    };

    return (
      <div>
        <AppBar title="Youtube" style={appBarStyle} />
        <AutoComplete
          hintText="Search"
          dataSource={this.state.dataSource}
          onUpdateInput={this.handleUpdateInput}
        />
        {/*this examples provided because actual dropdown for search doesn't work appropriately.*/}
        {/*it works with hardcoded array of strings, but doesn't work with generated from ajax array of strings*/}
        {/*digging into this problem is out of provided time, unfortunately, so you can imagine how the result looks */}
        {/*like looking at these examples*/}
        <SearchInfo query="duft punk" amount={1200} />
        <SongItem title="song duft punk very funny" description="some description" src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuVU9XEIi8bFmHL03tXLDZBolTTuQH3X8GDhB5S6IAgPPl19KrCwzyIAK8"/>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
