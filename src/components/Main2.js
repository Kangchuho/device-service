import React, {useState, useEffect} from 'react'
import moment from 'moment';
import Widget from './widget/Widget';

const Main2 = ({data}) => {

  // const [perfData, setPerfData] = useState([]);

  // useEffect(() => {
  //   async function onet() {
  //     console.log('~~~~~');
  //     const res = await fetch(`/api/cpuz`);
  //     const data = await res.json();
  //     console.log(data);
  //     setPerfData(data);
  //   };
  //   onet();
  // }, [])
  
  
  // console.log(perfData);

  let widgets = [];
  data.perfData.forEach(([key, value]) => {
    console.log(key, value);
    widgets.push(<Widget key={key} data={value} />);
  });

  return (
    <main>
				{/* <header className='py-3 pl-5 mb-4'>
					<h3>System Monitor</h3>
					<span className='header-date'>{moment().format('MMMM Do YYYY, h:mm:ss a')}</span>
				</header>
				<div className='widgets'>{widgets}</div> */}
		</main>
  )
}

export default Main2

export async function getServerSideProps() {
  // Fetch data from external API
  // const res = await fetch(`https://.../data`)
  // const data = await res.json()
  const res = await fetch(`/api/cpuz`);
  const data = await res.json();
  //console.log(data);

  // Pass data to the page via props
  return { props: { data } }
}