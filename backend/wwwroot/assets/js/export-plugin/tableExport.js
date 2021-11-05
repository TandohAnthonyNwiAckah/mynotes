/*The MIT License (MIT)

Copyright (c) 2014 https://github.com/kayalshri/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

(function($){
        $.fn.extend({
            tableExport: function(options) {
                var defaults = {
					separator: ',',
					ignoreColumn: [],
					tableName:'yourTableName',
					type:'csv',
					pdfFontSize:14,
					pdfLeftMargin:20,
					escape:'true',
					htmlContent:'true',
					consoleLog:'false',
					headerTitle:'',
					description:'',
					filename:'',
					formatTable:true
				};
                
				var options = $.extend(defaults, options);
				var el = this;
				
				if(defaults.type == 'csv' || defaults.type == 'txt'){
					defaults.htmlContent='false';
					// Header
					var tdData ="";
					$(el).find('thead').find('tr').each(function() {
					tdData += "\n";					
						$(this).filter(':visible').find('th').each(function(index,data) {
							if ($(this).css('display') != 'none'){
								if(defaults.ignoreColumn.indexOf(index) == -1){
									tdData += '"' + parseString($(this)) + '"' + defaults.separator;									
								}
							}
							
						});
						tdData = $.trim(tdData);
						tdData = $.trim(tdData).substring(0, tdData.length -1);
					});
					
					// Row vs Column
					$(el).find('tbody').find('tr').each(function() {
					tdData += "\n";
						$(this).filter(':visible').find('td').each(function(index,data) {
							if ($(this).css('display') != 'none'){
								if(defaults.ignoreColumn.indexOf(index) == -1){
									tdData += '"'+ parseString($(this)) + '"'+ defaults.separator;
								}
							}
						});
						//tdData = $.trim(tdData);
						tdData = $.trim(tdData).substring(0, tdData.length -1);
					});
					
					//output
					if(defaults.consoleLog == 'true'){
						console.log(tdData);
					}
					var blob = new Blob([tdData], {type: "text/plain;charset=utf-8"});
					saveAs(blob, defaults.fileName);
				}
				
				else if(defaults.type == 'excel'){
					var excel='';
					$(el).find('thead').find('tr').each(function() {
						excel += '<tr class="head">';
						$(this).filter(':visible').find('th').each(function(index,data) {
							if ($(this).css('display') != 'none'){					
								if(defaults.ignoreColumn.indexOf(index) == -1){
									excel += "<th>" + parseString($(this))+ "</th>";
								}
							}
						});	
						excel += '</tr>';						
					});					
					
					var rowCount=1;
					$(el).find('tbody').find('tr').each(function(tindex) {
						var alt="even";
						if (tindex % 2 == 0) {
							alt="odd"
						}
						excel += '<tr class="' + alt + '">';
						var colCount=0;
						$(this).filter(':visible').find('td').each(function(index,data) {
							if ($(this).css('display') != 'none'){	
								if(defaults.ignoreColumn.indexOf(index) == -1){
									excel += "<td>"+parseString($(this))+"</td>";
								}
							}
							colCount++;
						});															
						rowCount++;
						excel += '</tr>';
					});

					if(defaults.consoleLog == 'true'){
						console.log(excel);
					}
					
					var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:"+defaults.type+"' xmlns='http://www.w3.org/TR/REC-html40'>";
					excelFile += "<head>";
					excelFile += "<!--[if gte mso 9]>";
					excelFile += "<xml>";
					excelFile += "<x:ExcelWorkbook>";
					excelFile += "<x:ExcelWorksheets>";
					excelFile += "<x:ExcelWorksheet>";
					excelFile += "<x:Name>";
					excelFile += defaults.headerTitle;
					excelFile += "</x:Name>";
					excelFile += "<x:WorksheetOptions>";
					excelFile += "<x:DisplayGridlines/>";
					excelFile += "</x:WorksheetOptions>";
					excelFile += "</x:ExcelWorksheet>";
					excelFile += "</x:ExcelWorksheets>";
					excelFile += "</x:ExcelWorkbook>";
					excelFile += "</xml>";
					excelFile += "<![endif]-->";
					
					if(defaults.formatTable==true && defaults.type=='word'){
						excelFile += "<style>body{font-family:calibri;} table .head{background:#eee;font-weight:bold;text-transform:capitalize;} table{width:100%;} table td{padding:10px;} tr.even {background: #fafafa} tr.odd {background: #ffffff}</style>";
						
					}
					
					excelFile += "</head>";
					excelFile += "<body>";
					excelFile += excel;
					excelFile += "</body>";
					excelFile += "</html>";
					
					var blob = new Blob([excelFile], {type: "text/plain;charset=utf-8"});
					
					saveAs(blob, defaults.fileName);
					
				}
				
				else if(defaults.type == 'word'){
					var excel = $(this).html();
					var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:"+defaults.type+"' xmlns='http://www.w3.org/TR/REC-html40'>";
					excelFile += "<head>";
					excelFile += "<!--[if gte mso 9]>";
					excelFile += "<xml>";
					excelFile += "<x:ExcelWorkbook>";
					excelFile += "<x:ExcelWorksheets>";
					excelFile += "<x:ExcelWorksheet>";
					excelFile += "<x:Name>";
					excelFile += defaults.headerTitle;
					excelFile += "</x:Name>";
					excelFile += "<x:WorksheetOptions>";
					excelFile += "<x:DisplayGridlines/>";
					excelFile += "</x:WorksheetOptions>";
					excelFile += "</x:ExcelWorksheet>";
					excelFile += "</x:ExcelWorksheets>";
					excelFile += "</x:ExcelWorkbook>";
					excelFile += "</xml>";
					excelFile += "<![endif]-->";
					
					if(defaults.formatTable==true && defaults.type=='word'){
						excelFile += "<style>body{font-family:calibri;} table thead{background:#eee;font-weight:bold;text-transform:capitalize;border-bottom:1px solid #ccc;} table{width:100%;} table td{padding:10px;} table th{padding:10px;} tbody tr:nth-child(odd){background: #fafafa}</style>";
					}
					excelFile += "</head>";
					excelFile += "<body>";
					excelFile += "<p><h1>";
					excelFile += defaults.headerTitle;
					excelFile += "</h1></p><table>";
					excelFile += excel;
					excelFile += "</table></body>";
					excelFile += "</html>";
					
					var blob = new Blob([excelFile], {type: "text/plain;charset=utf-8"});
					
					saveAs(blob, defaults.fileName);
					
				}
				
				else if(defaults.type == 'image'){
					html2canvas($(el), {
						onrendered: function(canvas) {	
							var blob = new Blob([excelFile], {type: "text/plain;charset=utf-8"});
							canvas.toBlob(function(blob){ saveAs(blob,defaults.fileName); });
							
							//var img = canvas.toDataURL("image/png");
							//window.open(img);
							
						}
					});		
				}
				
				function parseString(data){
				
					if(defaults.htmlContent == 'true'){
						content_data = data.html().trim();
					}else{
						content_data = data.text().trim();
					}
					
					if(defaults.escape == 'true'){
						content_data = escape(content_data);
					}
					
					
					
					return content_data;
				}
			
			}
        });
    })(jQuery);
        
