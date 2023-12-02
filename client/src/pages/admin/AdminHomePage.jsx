import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Chart from 'chart.js/auto'

const AdminHomePage = () => {
  const [categoryStats, setCategoryStats] = useState([])
  const [incomeStats, setIncomeStats] = useState([])
  const chartRef = useRef(null)
  const incomeChartRef = useRef(null)

  const labels = categoryStats.map((stat) => stat._id)
  const data = categoryStats.map((stat) => stat.totalQuantity)

  const fetchSalesPerCategory = async () => {
    try {
      const { data } = await axios.get('/admin/stats/sales-per-category')
      if (data.success) {
        setCategoryStats(data.categoryStats)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#AA6384', '#2CA21B']

  useEffect(() => {
    let myChart
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (myChart) {
        myChart.destroy()
      }
      myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Sales per Category',
              data: data,
              backgroundColor: colors, // Use the colors array here
              borderColor: 'rgba(75, 192, 192, 1)', // customize as needed
              borderWidth: 1, // customize as needed
            },
          ],
        },
        options: {
          responsive: true,
        },
      })
    }
    return () => {
      if (myChart) {
        myChart.destroy()
      }
    }
  }, [chartRef, labels, data])

  const fetchIncomePerDay = async () => {
    try {
      const { data } = await axios.get('/admin/stats/income-per-day')
      if (data.success) {
        setIncomeStats(data.incomeStats)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    let myChart
    if (incomeChartRef.current) {
      const ctx = incomeChartRef.current.getContext('2d')
      if (myChart) {
        myChart.destroy()
      }
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: incomeStats.map((stat) => stat._id),
          datasets: [
            {
              label: 'Income per Day',
              data: incomeStats.map((stat) => stat.totalIncome),
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // customize as needed
              borderColor: 'rgba(75, 192, 192, 1)', // customize as needed
              borderWidth: 1, // customize as needed
            },
          ],
        },
        options: {
          responsive: true,
        },
      })
    }
    return () => {
      if (myChart) {
        myChart.destroy()
      }
    }
  }, [incomeChartRef, incomeStats])

  useEffect(() => {
    fetchSalesPerCategory()
    fetchIncomePerDay()
  }, [])

  return (
    <div className="p-2 w-full">
      <div className="flex w-full max-lg:flex-col justify-center items-center gap-y-20 ">
        <div className="w-full flex justify-center">
          <canvas ref={incomeChartRef} className="" />
        </div>
        <div className="w-full flex justify-center">
          <canvas ref={chartRef} className="max-w-fit" />
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage
