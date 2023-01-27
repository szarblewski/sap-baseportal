import React, { useContext } from 'react';
import './App.css';
import { Col, CustomProvider, FlexboxGrid } from 'rsuite';
import Header from './header/header';
import Menu from './menu/menu';
import Footer from './footer/footer';
import { Context } from '../context';




function App(props) {
  
  const { Theme } = useContext(Context);

  return (

    <CustomProvider theme={Theme.name}>
      <FlexboxGrid className='App'>
        <FlexboxGrid.Item className='Header' colspan={24}><Header /></FlexboxGrid.Item>
        <FlexboxGrid.Item className='Body' colspan={24}>
          <FlexboxGrid.Item className='Menu' as={Col}><Menu /></FlexboxGrid.Item>
          {/* <FlexboxGrid.Item className='Content' as={Col}>

          </FlexboxGrid.Item> */}
          <div className='ContentHeader'></div>
          <div className='ContentBody'>{props.children}</div>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item className='Footer' colspan={24} ><Footer /></FlexboxGrid.Item>
      </FlexboxGrid>
    </CustomProvider>

    

  );
}

export default App;

