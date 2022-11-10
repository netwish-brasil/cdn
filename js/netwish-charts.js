/////////////// GRAFICOS

var GeraGrafico = function(var_url, var_titulo, var_type, var_id, var_coluna, var_sql, var_usuario) {

    var url = var_url;
    var interval = 50000;
    var ctx_live = document.getElementById(var_id);
    bloco = [];
    const cor = ["#007bff", "#ffc107", "#20c997", "#fd7e14", "#28a745", "red", "#17a2b8", "#6c757d", "#ff0066", "#dc3545", "#23ff66", "#343a40", "#6610f2", "#6f42c1", "#e83e8c"];

    if (var_type == 'bar-stacked') {
        var_type = 'bar';
        var xy = {
            x: {
                stacked: true,
            },
            y: {
                stacked: true
            }
        };
    }

    $.each(var_coluna.split(","), function(index, value) {
        // console.log(index);
        a = {
            data: [],
            label: value,
            borderWidth: (var_type == 'line') ? 2 : '',
            backgroundColor: cor[index],
            borderColor: (var_type == 'pie') ? '#fff' : cor[index],
            fill: false,
        }
        bloco.push(a);
    });

    var liveChart = new Chart(ctx_live, {
        type: var_type,
        data: {
            labels: [],
            datasets: bloco,
        },
        options: {

            onClick: (e, activeEls) => {
                let datasetIndex = activeEls[0].datasetIndex;
                let dataIndex = activeEls[0].index;
                let datasetLabel = e.chart.data.datasets[datasetIndex].label;
                let value = e.chart.data.datasets[datasetIndex].data[dataIndex];
                let label = e.chart.data.labels[dataIndex];
                console.log("click", datasetLabel, label, value);
                // alert(label);
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },

                title: {
                    display: true,
                    text: var_titulo
                },
                // tooltips: {
                //     callbacks: {
                //         label: function(context) {
                //             let label = context.dataset.label || '';

                //             if (label) {
                //                 label += ': ';
                //             }
                //             if (context.parsed.y !== null) {
                //                 label += new Intl.NumberFormat('en-US', {
                //                     style: 'currency',
                //                     currency: 'USD'
                //                 }).format(context.parsed.y);
                //             }
                //             return label;
                //         }
                //     }
                // },
                // tooltips: {
                //     mode: 'index',
                //     intersect: false,
                //     callbacks: {
                //         label: function(tooltipItem, data) {
                //             return "R$ " + Number(tooltipItem.yLabel).toFixed(0).replace(/./g, function(c, i, a) {
                //                 return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
                //             });
                //         }
                //     }
                // },
                // hover: {
                //     mode: 'nearest',
                //     intersect: true
                // },
            },
            scales: xy
        }
    });

    var GetInfo = function() {
        $.ajax({
            url: url,
            method: "POST",
            data: {
                id_usuario: var_usuario,
                sql: var_sql
            },
            success: function(res) {
                liveChart.data.labels = [];
                $.each(var_coluna.split(","), function(index, value) {
                    liveChart.data.datasets[index].data = [];
                });

                conteudo = ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8', 'data9', 'data10'];
                $.each(JSON.parse(res), function(index, value) {
                    liveChart.data.labels.push(value["labels"]);
                    $.each(var_coluna.split(","), function(index2, value2) {
                        liveChart.data.datasets[index2].data.push(value[conteudo[index2]]);

                        if (var_type == 'pie') {
                            liveChart.data.datasets[index2].backgroundColor = cor;
                        }
                    });
                });
                liveChart.update();
            },
            complete: function() {
                // Schedule the next
                setTimeout(GetInfo, interval);
            }
        });
    };
    GetInfo();

    console.log(liveChart.data);
};