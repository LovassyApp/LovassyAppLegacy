using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Linq;
using ExcelDataReader;

namespace Backboard
{
    
    
    public class ExcelProcessor
    {
        private string filename = string.Empty;
        private BackgroundWorker worker;
        private DataSet rawData;

        public ExcelProcessor(string filename, BackgroundWorker worker)
        {
            this.filename = filename;
            this.worker = worker;
        }

        public void read()
        {
            worker.ReportProgress(0);
            using (var stream = File.Open(filename, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader((stream)))
                {
                    
                    this.rawData = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        UseColumnDataType = true,
                        FilterSheet = (tableReader, sheetIndex) => sheetIndex == 0,
                        ConfigureDataTable = (tableReader) => new ExcelDataTableConfiguration()
                        {
                            EmptyColumnNamePrefix = "Column",
                            UseHeaderRow = true,
                            ReadHeaderRow = (rowReader) => {},
                            FilterRow = (rowReader) => {
                               
                                worker.ReportProgress((int)Math.Ceiling((decimal)rowReader.Depth / (decimal)rowReader.RowCount * (decimal)100));
                                // progress is in the range 0..100
                                return true;
                            }
                        }
                    });
                }
            }
        }

        public List<Dictionary<string, string>> convert()
        {
            int counter = 0;
            worker.ReportProgress(0);
            var table = this.rawData.Tables[0].AsEnumerable();
            return table.Select(
                row =>
                {
                    counter++;
                    worker.ReportProgress((int)Math.Ceiling((decimal)counter / (decimal)table.Count() * (decimal)100));
                    return this.rawData.Tables[0].Columns.Cast<DataColumn>().ToDictionary(
                        column => column.ColumnName,
                        column => row[column].ToString());

                }).ToList();
        }
    }
}