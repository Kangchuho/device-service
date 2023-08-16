import Image from 'next/image'
import { Inter } from 'next/font/google'
// import Main2 from '@/components/Main2'
import moment from 'moment';
import { Component } from 'react';
import Widget from '@/components/widget/Widget';



const inter = Inter({ subsets: ['latin'] })

//* dbservice 초기화를 진행합니다.?? 아니다..
//! 서비스에서 한번만 실행되는 지점에서 연결초기화 후 요청시 참조 및 갱신하는 구조.

export default function Home({data}) {

  // if(type window === 'undefined'){
	// 	return null
	// }

  const {perfData} = data;
  //console.log(perfData);
  let widgets = [];
  widgets.push(<Widget {...perfData} />);
  // Object.entries(perfData).forEach(([key, value]) => {
  //   // console.log(key, value);
  //   //widgets.push(<Widget key={key} data={value} />);
    
  // });

  return (
    <main>
				<header className='py-3 pl-5 mb-4'>
					<h3>System Monitor</h3>
					<span className='header-date'>{moment().format('MMMM Do YYYY, h:mm:ss a')}</span>
				</header>
				<div className='widgets'>{widgets}</div>
			</main>
  )
}


export async function getServerSideProps() {
  // Fetch data from external API
  // const res = await fetch(`https://.../data`)
  // const data = await res.json()
  const res = await fetch(`http://localhost:3000/api/cpuz`);
  const data = await res.json();
  //console.log(data);

  // Pass data to the page via props
  return {
    props: {
      data: data,
    },
   
  }
}