import styled, { createGlobalStyle } from 'styled-components';
import pattern_bg from './pattern_bg.png';
import { MdChevronRight } from 'react-icons/md';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import iconLocation from './iconLocation.svg';
import { Icon } from 'leaflet';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }
`;

const MainDiv = styled.div`
    position: relative;
`;

const Div1 = styled.div`
  background-image: url(${pattern_bg});
  margin-top: -20px;
  width: auto;
  height: 200px;
  text-align: center;
  padding: 30px;
`;

const H2 = styled.h2`
  color: white;
`;

const InputDiv = styled.form`
  display: flex;
  justify-items: center;
  justify-content: center;
`;

const Input = styled.input`
  width: 400px;
  height: 20px;
  border: none;
  border-top-left-radius: 4mm;
  border-bottom-left-radius: 4mm;
  cursor: pointer;
  padding: 15px;
  padding-left: 25px;
  font-size: 15px;
  outline: none;

  @media screen and (max-width: 50em) {
    font-size: 12px;
  }
`;

const SearchButton = styled.button`
    background-color: black;
    height: 50px;
    width: 50px;
    padding: 10px;
    border-top-right-radius: 4mm;
    border-bottom-right-radius: 4mm;
    cursor: pointer;
    color: white;
    border: none;

    &:hover {
      background: #404040;
    }
`;

const SearchArrow = styled(MdChevronRight)`
  font-size: 30px;
  align-self: center;
`;

const SearchResult = styled.div`
    border: none;
    border-radius: 3mm;
    background: white;
    margin-top: 10px;
    padding: 30px;
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    text-align: left;
    column-gap: 20px;
    position: absolute;
    left: 70px;
    right: 70px;
    top: 190px;
    z-index: 1000;

    @media screen and (max-width: 50em) {
      display: grid;
      grid-template-columns: 1fr;
      height: 250px;
      left: 40px;
      right: 40px;
      text-align: center;
      gap: 0px;
      padding: 10px;
      margin-top: -10px;

    }
`;

const Span = styled.span`
    font-size: 10px;
    color: #999999;

`;

const Div2 = styled.div`
    border-right: 1px solid #cccccc;

    @media screen and (max-width: 50em) {
      border: none;
    }
  
`;

const P = styled.p`
  @media screen and (max-width: 50em) {
      margin: 5px;
    }
`;

const Mapstyles = { 
  height: "70vh", 
  width: "auto",
}

const myIcon = new Icon({
  iconUrl: iconLocation,
  iconSize: [46, 55],
  iconAnchor: [23, 55],
  popupAnchor: [-3, -76],
});

function App() {
  const [getAddress, setGetAddress] = useState('');
  const [isError, setisError] = useState(null);
  const [ip, setIp] = useState('');

  const api_key = 'at_YLGMtRHte19FkD5sxI5ZzERxtNGlp';
  const api_url = 'https://geo.ipify.org/api/v2/country,city?';
  const url = api_url + 'apiKey=' + api_key + '&ipAddress=' + ip;

  

  const handleClick = (e) => {
    e.preventDefault();
    fetch(url)
      .then(response => {
        if(!response.ok) {
          throw Error('Could not fetch this IP address');
        }
        return response.json();
      })
      .then(data => {
        setGetAddress(data);
        setisError(null);
      })
      .catch(err => {
        setisError(err.message);
      })
  };


  return (
    <MainDiv>
      <GlobalStyle />
      <Div1>
        <H2>IP Address Tracker</H2>
        <InputDiv onSubmit={handleClick}>
          <Input 
              type='text' 
              // required='required'
              placeholder='Search for any IP address or domain' 
              onChange={(e) => { setIp(e.target.value)}}
            /> 
          <SearchButton type='submit'><SearchArrow /></SearchButton>
        </InputDiv>
      </Div1>
      <SearchResult>
          { isError && <div>{isError}</div> }
          {getAddress && 
            <>
              <Div2><Span><strong>IP ADDRESS</strong></Span> <P><b> {getAddress.ip} </b></P></Div2>
              <Div2><Span><strong>LOCATION</strong></Span>
                <P><b>{getAddress.location.region}, {getAddress.location.country}</b></P>
                <P><b>{getAddress.location.postalCode}</b></P>
              </Div2>
              <Div2><Span><strong>TIMEZONE</strong></Span><P><b>UTC {getAddress.location.timezone}</b></P></Div2>
              <div><Span><strong>ISP</strong></Span><P><b>{getAddress.isp}</b></P></div>
            </>
          }
      </SearchResult>
      <div>
        { isError && <div>{isError}</div> }
        {getAddress && 
            <MapContainer 
              center={[getAddress.location.lat, getAddress.location.lng]} 
              zoom={13} 
              scrollWheelZoom={true} 
              style={Mapstyles}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[getAddress.location.lat, getAddress.location.lng]} 
                icon= {myIcon}
              />
            </MapContainer>  
        }
      </div>    
        
    </MainDiv>
  );
}

export default App;
