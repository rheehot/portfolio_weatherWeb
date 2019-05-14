import React, { Component } from 'react';

import changeWCCode from '../functions/changeWeatherConditionCode';
import { _getMainCurrLocaInfo } from '../functions/changeWeatherData';

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_API_KEY;

export default class Test extends Component {
  state = {
    isLoaded: false,
    error: null,
    address: null,
    temp: null,
    weatherCondition: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const obj = await _getMainCurrLocaInfo(position.coords.latitude, position.coords.longitude);
        this.setState({
          address: obj.address,
          temp: obj.weather.main.temp,
          isLoaded: true
        });
        console.log(this.state);
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  }

  _getInfoJson = async (lat, lon) => {
    // 주소 정보 가져오기
    await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`
      }
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          address: json.documents[0].address_name
        });
        console.log(json.documents[0].address_name);
      })
      .then(this._getWeatherJson(lat, lon));
    // 주소 정보 다 가져온 이후 날씨 정보 가져오기
  };

  _getWeatherJson = (lat, lon) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${WEATHER_API_KEY}&units=metric`
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          temp: json.main.temp,
          weatherCondition: changeWCCode(json.weather[0].id),
          isLoaded: true
        });
        console.log(this.state);
      });
  };

  render() {
    const { isLoaded, error } = this.state;
    return (
      <div>
        {isLoaded ? (
          <p style={{ color: '#f1f1f1' }}>콘솔 로그를 확인하세요.</p>
        ) : error ? (
          <p style={{ color: '#f1f1f1' }}>위치 허용해주세요</p>
        ) : (
          <p style={{ color: '#f1f1f1' }}>로딩중..</p>
        )}
      </div>
    );
  }
}
