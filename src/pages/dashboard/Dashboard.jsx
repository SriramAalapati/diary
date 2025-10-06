import React from 'react'
import Layout from '../../layout/Layout'

const Dashboard = () => {
  return (
    <Layout>
        <textarea
        className="h-full w-full border border-yellow-300 focus:border-yellow-500 active:border-yellow-500 hover:border-yellow-500 caret-red-600"
        placeholder="Start writing your thoughts..."
        
      >

          
      </textarea>
    </Layout>
  )
}

export default Dashboard