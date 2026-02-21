import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { TrendingUp, DollarSign, Fuel, Wrench, Download } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashData, analyticsData] = await Promise.all([
        analyticsAPI.getDashboard().catch(() => null),
        analyticsAPI.getAnalytics().catch(() => null)
      ]);
      
      console.log('Analytics data:', { dashData, analyticsData });
      
      // Combine both responses
      const combined = {
        ...dashData,
        ...analyticsData,
        utilization: dashData?.fleet?.utilization || 0,
        totalRevenue: analyticsData?.summary?.totalOperationalCost * 1.5 || 0,
        fuelCost: analyticsData?.summary?.totalFuelCost || 0,
        maintenanceCost: analyticsData?.summary?.totalMaintenanceCost || 0,
        totalCost: analyticsData?.summary?.totalOperationalCost || 0,
        avgCostPerTrip: dashData?.trips?.completed > 0 
          ? (analyticsData?.summary?.totalOperationalCost || 0) / dashData.trips.completed 
          : 0,
        avgEfficiency: analyticsData?.fuelEfficiency?.length > 0
          ? analyticsData.fuelEfficiency.reduce((sum, f) => sum + f.efficiency, 0) / analyticsData.fuelEfficiency.length
          : 0,
        vehiclesByStatus: dashData?.fleet ? [
          { name: 'On Trip', value: dashData.fleet.active },
          { name: 'Available', value: dashData.fleet.available },
          { name: 'In Shop', value: dashData.fleet.inShop }
        ].filter(v => v.value > 0) : [],
        vehiclesByType: [],
        topDrivers: []
      };
      
      setAnalytics(combined);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!analytics) return;

    const reportDate = new Date().toLocaleString();
    
    // Create comprehensive report content
    const reportContent = `
FLEETFLOW ANALYTICS REPORT
Generated: ${reportDate}
${'='.repeat(60)}

KEY PERFORMANCE INDICATORS
${'='.repeat(60)}
Fleet Utilization:        ${analytics.utilization}%
Total Revenue:            ₹${(analytics.totalRevenue || 0).toLocaleString('en-IN')}
Fuel Costs:               ₹${(analytics.fuelCost || 0).toLocaleString('en-IN')}
Maintenance Costs:        ₹${(analytics.maintenanceCost || 0).toLocaleString('en-IN')}

FINANCIAL SUMMARY
${'='.repeat(60)}
Total Operational Cost:   ₹${(analytics.totalCost || 0).toLocaleString('en-IN')}
Average Cost per Trip:    ₹${(analytics.avgCostPerTrip || 0).toFixed(2)}
Fleet Efficiency:         ${(analytics.avgEfficiency || 0).toFixed(2)} km/L

FLEET STATUS DISTRIBUTION
${'='.repeat(60)}
${analytics.vehiclesByStatus.map(v => `${v.name.padEnd(20)} ${v.value} vehicles`).join('\n')}

${analytics.topDrivers && analytics.topDrivers.length > 0 ? `
TOP PERFORMING DRIVERS
${'='.repeat(60)}
${analytics.topDrivers.slice(0, 3).map((d, i) => 
  `${i + 1}. ${d.name}\n   Trips Completed: ${d.completed}\n   Safety Score: ${d.safety}%`
).join('\n\n')}
` : ''}

${'='.repeat(60)}
End of Report
    `.trim();

    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FleetFlow_Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!analytics) return;

    // Create CSV content
    let csvContent = 'FleetFlow Analytics Report\n';
    csvContent += `Generated,${new Date().toLocaleString()}\n\n`;
    
    csvContent += 'Key Metrics\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Fleet Utilization,${analytics.utilization}%\n`;
    csvContent += `Total Revenue,₹${(analytics.totalRevenue || 0).toFixed(2)}\n`;
    csvContent += `Fuel Costs,₹${(analytics.fuelCost || 0).toFixed(2)}\n`;
    csvContent += `Maintenance Costs,₹${(analytics.maintenanceCost || 0).toFixed(2)}\n`;
    csvContent += `Total Operational Cost,₹${(analytics.totalCost || 0).toFixed(2)}\n`;
    csvContent += `Average Cost per Trip,₹${(analytics.avgCostPerTrip || 0).toFixed(2)}\n`;
    csvContent += `Fleet Efficiency,${(analytics.avgEfficiency || 0).toFixed(2)} km/L\n\n`;
    
    csvContent += 'Fleet Status Distribution\n';
    csvContent += 'Status,Count\n';
    analytics.vehiclesByStatus.forEach(v => {
      csvContent += `${v.name},${v.value}\n`;
    });

    if (analytics.topDrivers && analytics.topDrivers.length > 0) {
      csvContent += '\nTop Performing Drivers\n';
      csvContent += 'Name,Trips Completed,Safety Score\n';
      analytics.topDrivers.forEach(d => {
        csvContent += `${d.name},${d.completed},${d.safety}%\n`;
      });
    }

    // Create and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FleetFlow_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    if (!analytics) return;

    // Create Excel-compatible HTML table
    let excelContent = `
      <html xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8">
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Analytics Report</x:Name>
                <x:WorksheetOptions><x:Print><x:ValidPrinterInfo/></x:Print></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #06b6d4; color: white; padding: 10px; text-align: left; font-weight: bold; }
          td { padding: 8px; border: 1px solid #ddd; }
          .header { font-size: 18px; font-weight: bold; margin: 20px 0; }
          .section { margin-top: 30px; }
          .metric-label { font-weight: bold; background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <div class="header">FleetFlow Analytics Report</div>
        <p>Generated: ${new Date().toLocaleString()}</p>
        
        <div class="section">
          <h2>Key Performance Indicators</h2>
          <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td class="metric-label">Fleet Utilization</td><td>${analytics.utilization}%</td></tr>
            <tr><td class="metric-label">Total Revenue</td><td>₹${(analytics.totalRevenue || 0).toLocaleString('en-IN')}</td></tr>
            <tr><td class="metric-label">Fuel Costs</td><td>₹${(analytics.fuelCost || 0).toLocaleString('en-IN')}</td></tr>
            <tr><td class="metric-label">Maintenance Costs</td><td>₹${(analytics.maintenanceCost || 0).toLocaleString('en-IN')}</td></tr>
            <tr><td class="metric-label">Total Operational Cost</td><td>₹${(analytics.totalCost || 0).toLocaleString('en-IN')}</td></tr>
            <tr><td class="metric-label">Average Cost per Trip</td><td>₹${(analytics.avgCostPerTrip || 0).toFixed(2)}</td></tr>
            <tr><td class="metric-label">Fleet Efficiency</td><td>${(analytics.avgEfficiency || 0).toFixed(2)} km/L</td></tr>
          </table>
        </div>
        
        <div class="section">
          <h2>Fleet Status Distribution</h2>
          <table>
            <tr><th>Status</th><th>Count</th></tr>
            ${analytics.vehiclesByStatus.map(v => `<tr><td>${v.name}</td><td>${v.value}</td></tr>`).join('')}
          </table>
        </div>
        
        ${analytics.topDrivers && analytics.topDrivers.length > 0 ? `
        <div class="section">
          <h2>Top Performing Drivers</h2>
          <table>
            <tr><th>Name</th><th>Trips Completed</th><th>Safety Score</th></tr>
            ${analytics.topDrivers.map(d => `<tr><td>${d.name}</td><td>${d.completed}</td><td>${d.safety}%</td></tr>`).join('')}
          </table>
        </div>
        ` : ''}
      </body>
      </html>
    `;

    // Create and download Excel file
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FleetFlow_Analytics_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!analytics) return;

    // Create a printable HTML page that can be saved as PDF
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>FleetFlow Analytics Report</title>
        <style>
          @page { margin: 20mm; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #06b6d4;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #06b6d4;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 10px 0 0 0;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #06b6d4;
            border-left: 4px solid #06b6d4;
            padding-left: 10px;
            margin-bottom: 15px;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          .kpi-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background: #f9f9f9;
          }
          .kpi-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .kpi-value {
            font-size: 24px;
            font-weight: bold;
            color: #06b6d4;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background-color: #06b6d4;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚗 FleetFlow Analytics Report</h1>
          <p>Generated on ${new Date().toLocaleString('en-IN', { 
            dateStyle: 'full', 
            timeStyle: 'short' 
          })}</p>
        </div>

        <div class="section">
          <h2>Key Performance Indicators</h2>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Fleet Utilization</div>
              <div class="kpi-value">${analytics.utilization}%</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Total Revenue</div>
              <div class="kpi-value">₹${(analytics.totalRevenue || 0).toLocaleString('en-IN')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Fuel Costs</div>
              <div class="kpi-value">₹${(analytics.fuelCost || 0).toLocaleString('en-IN')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Maintenance Costs</div>
              <div class="kpi-value">₹${(analytics.maintenanceCost || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Financial Summary</h2>
          <table>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Details</th>
            </tr>
            <tr>
              <td><strong>Total Operational Cost</strong></td>
              <td>₹${(analytics.totalCost || 0).toLocaleString('en-IN')}</td>
              <td>Fuel + Maintenance</td>
            </tr>
            <tr>
              <td><strong>Average Cost per Trip</strong></td>
              <td>₹${(analytics.avgCostPerTrip || 0).toFixed(2)}</td>
              <td>Based on completed trips</td>
            </tr>
            <tr>
              <td><strong>Fleet Efficiency</strong></td>
              <td>${(analytics.avgEfficiency || 0).toFixed(2)} km/L</td>
              <td>Average fuel efficiency</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>Fleet Status Distribution</h2>
          <table>
            <tr>
              <th>Status</th>
              <th>Vehicle Count</th>
              <th>Percentage</th>
            </tr>
            ${analytics.vehiclesByStatus.map(v => {
              const total = analytics.vehiclesByStatus.reduce((sum, item) => sum + item.value, 0);
              const percentage = ((v.value / total) * 100).toFixed(1);
              return `
                <tr>
                  <td><strong>${v.name}</strong></td>
                  <td>${v.value}</td>
                  <td>${percentage}%</td>
                </tr>
              `;
            }).join('')}
          </table>
        </div>

        ${analytics.topDrivers && analytics.topDrivers.length > 0 ? `
        <div class="section">
          <h2>Top Performing Drivers</h2>
          <table>
            <tr>
              <th>Rank</th>
              <th>Driver Name</th>
              <th>Trips Completed</th>
              <th>Safety Score</th>
            </tr>
            ${analytics.topDrivers.slice(0, 5).map((d, i) => `
              <tr>
                <td><strong>#${i + 1}</strong></td>
                <td>${d.name}</td>
                <td>${d.completed}</td>
                <td>${d.safety}%</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ` : ''}

        <div class="footer">
          <p>This report is generated by FleetFlow Management System</p>
          <p>© ${new Date().getFullYear()} FleetFlow. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    
    // Trigger print dialog after content loads
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  if (loading) {
    return (
      <Layout title="Analytics & Reports" subtitle="Data-driven insights">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const vehicleStatusData = analytics?.vehiclesByStatus || [];
  const vehicleTypeData = analytics?.vehiclesByType || [];

  return (
    <Layout title="Analytics & Reports" subtitle="Data-driven insights">
      <div className="flex justify-end mb-5 gap-3 flex-wrap">
        <button 
          onClick={exportPDF}
          className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center gap-2 text-rose-400"
          disabled={!analytics}
        >
          <Download size={16} /> Export PDF
        </button>
        <button 
          onClick={exportExcel}
          className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center gap-2 text-emerald-400"
          disabled={!analytics}
        >
          <Download size={16} /> Export Excel
        </button>
        <button 
          onClick={exportCSV}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 text-silver-300"
          disabled={!analytics}
        >
          <Download size={16} /> Export CSV
        </button>
        <button 
          onClick={exportReport}
          className="btn-primary flex items-center gap-2 text-white"
          disabled={!analytics}
        >
          <Download size={16} /> Export TXT
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-silver-500 uppercase tracking-widest font-mono">Fleet Utilization</p>
              <p className="font-display text-2xl text-cyan-400">{analytics?.utilization || 0}%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <DollarSign size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-silver-500 uppercase tracking-widest font-mono">Total Revenue</p>
              <p className="font-display text-2xl text-emerald-400">₹{((analytics?.totalRevenue || 0) / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Fuel size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-silver-500 uppercase tracking-widest font-mono">Fuel Costs</p>
              <p className="font-display text-2xl text-amber-400">₹{((analytics?.fuelCost || 0) / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Wrench size={18} className="text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-silver-500 uppercase tracking-widest font-mono">Maintenance</p>
              <p className="font-display text-2xl text-rose-400">₹{((analytics?.maintenanceCost || 0) / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Vehicle Status Distribution */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-4">Fleet Status Distribution</h3>
          {vehicleStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-silver-500">
              No data available
            </div>
          )}
        </div>

        {/* Vehicle Type Distribution */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-4">Fleet by Vehicle Type</h3>
          {vehicleTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vehicleTypeData}>
                <XAxis dataKey="name" tick={{ fill: '#636d82', fontSize: 11 }} />
                <YAxis tick={{ fill: '#636d82', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-silver-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="glass-card p-5">
        <h3 className="font-display text-lg silver-text mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-2">Total Operational Cost</p>
            <p className="font-display text-3xl text-silver-300">₹{((analytics?.totalCost || 0) / 1000).toFixed(1)}K</p>
            <p className="text-xs text-silver-500 mt-2">Fuel + Maintenance</p>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-2">Average Cost per Trip</p>
            <p className="font-display text-3xl text-silver-300">₹{analytics?.avgCostPerTrip?.toFixed(0) || 0}</p>
            <p className="text-xs text-silver-500 mt-2">Based on completed trips</p>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-2">Fleet Efficiency</p>
            <p className="font-display text-3xl text-silver-300">{analytics?.avgEfficiency?.toFixed(2) || 0} km/L</p>
            <p className="text-xs text-silver-500 mt-2">Average fuel efficiency</p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      {analytics?.topDrivers && analytics.topDrivers.length > 0 && (
        <div className="glass-card p-5 mt-4">
          <h3 className="font-display text-lg silver-text mb-4">Top Performing Drivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.topDrivers.slice(0, 3).map((driver, i) => (
              <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-700 to-obsidian-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{driver.name?.split(' ').map(n => n[0]).join('') || 'N/A'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-silver-300 font-medium">{driver.name}</p>
                    <p className="text-xs text-silver-500 font-mono">Safety: {driver.safety}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-silver-500">Trips Completed</span>
                  <span className="text-cyan-400 font-mono">{driver.completed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
