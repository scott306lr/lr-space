var view;

function render(spec) {
  view = new vega.View(vega.parse(spec), {
    renderer:  'canvas',  // renderer (canvas or svg)
    container: '#view',   // parent DOM container
    hover:     true       // enable hover processing
  });
  return view.runAsync();
}
setTimeout(function(){console.log(view.data("iris"))}, 2000);

const spec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A scatter plot matrix of iris data with interactive linked selections.",
  "padding": 10,
  "config": {
    "axis": {
      "tickColor": "#ccc"
    }
  },

  "signals": [
    { "name": "chartSize", "value": 170 },
    { "name": "chartPad", "value": 20 },
    { "name": "chartStep", "update": "chartSize + chartPad" },
    { "name": "width", "update": "chartStep * 4" },
    { "name": "height", "update": "chartStep * 4" },
    {
      "name": "cell", "value": null,
      "on": [
        {
          "events": "@cell:pointerdown", "update": "group()"
        },
        {
          "events": "@cell:pointerup",
          "update": "!span(brushX) && !span(brushY) ? null : cell"
        }
      ]
    },
    {
      "name": "brushX", "value": 0,
      "on": [
        {
          "events": "@cell:pointerdown",
          "update": "[x(cell), x(cell)]"
        },
        {
          "events": "[@cell:pointerdown, window:pointerup] > window:pointermove",
          "update": "[brushX[0], clamp(x(cell), 0, chartSize)]"
        },
        {
          "events": {"signal": "delta"},
          "update": "clampRange([anchorX[0] + delta[0], anchorX[1] + delta[0]], 0, chartSize)"
        }
      ]
    },
    {
      "name": "brushY", "value": 0,
      "on": [
        {
          "events": "@cell:pointerdown",
          "update": "[y(cell), y(cell)]"
        },
        {
          "events": "[@cell:pointerdown, window:pointerup] > window:pointermove",
          "update": "[brushY[0], clamp(y(cell), 0, chartSize)]"
        },
        {
          "events": {"signal": "delta"},
          "update": "clampRange([anchorY[0] + delta[1], anchorY[1] + delta[1]], 0, chartSize)"
        }
      ]
    },
    {
      "name": "down", "value": [0, 0],
      "on": [{"events": "@brush:pointerdown", "update": "[x(cell), y(cell)]"}]
    },
    {
      "name": "anchorX", "value": null,
      "on": [{"events": "@brush:pointerdown", "update": "slice(brushX)"}]
    },
    {
      "name": "anchorY", "value": null,
      "on": [{"events": "@brush:pointerdown", "update": "slice(brushY)"}]
    },
    {
      "name": "delta", "value": [0, 0],
      "on": [
        {
          "events": "[@brush:pointerdown, window:pointerup] > window:pointermove",
          "update": "[x(cell) - down[0], y(cell) - down[1]]"
        }
      ]
    },
    {
      "name": "rangeX", "value": [0, 0],
      "on": [
        {
          "events": {"signal": "brushX"},
          "update": "invert(cell.datum.x.data + 'X', brushX)"
        }
      ]
    },
    {
      "name": "rangeY", "value": [0, 0],
      "on": [
        {
          "events": {"signal": "brushY"},
          "update": "invert(cell.datum.y.data + 'Y', brushY)"
        }
      ]
    },
    {
      "name": "cursor", "value": "'default'",
      "on": [
        {
          "events": "[@cell:pointerdown, window:pointerup] > window:pointermove!",
          "update": "'nwse-resize'"
        },
        {
          "events": "@brush:pointermove, [@brush:pointerdown, window:pointerup] > window:pointermove!",
          "update": "'move'"
        },
        {
          "events": "@brush:pointerout, window:pointerup",
          "update": "'default'"
        }
      ]
    }
  ],

  "data": [
    {
      "name": "iris",
      "url": "https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/iris.csv",
      "format": {"type": "csv", "parse": "auto"},
      "transform": [
        {"type": "filter", "expr": "datum['class'] != null"}
      ]
    },
    {
      "name": "fields",
      "values": [
        "sepal length",
        "sepal width",
        "petal length",
        "petal width"
      ]
    },
    {
      "name": "cross",
      "source": "fields",
      "transform": [
        { "type": "cross", "as": ["x", "y"] },
        { "type": "formula", "as": "xscale", "expr": "datum.x.data + 'X'" },
        { "type": "formula", "as": "yscale", "expr": "datum.y.data + 'Y'" }
      ]
    }
  ],

  "scales": [
    {
      "name": "groupx",
      "type": "band",
      "range": "width",
      "domain": {"data": "fields", "field": "data"}
    },
    {
      "name": "groupy",
      "type": "band",
      "range": [{"signal": "height"}, 0],
      "domain": {"data": "fields", "field": "data"}
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": {"data": "iris", "field": "class"},
      "range": "category"
    },

    {
      "name": "sepal lengthX", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "sepal length"},
      "range": [0, {"signal": "chartSize"}]
    },
    {
      "name": "sepal widthX", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "sepal width"},
      "range": [0, {"signal": "chartSize"}]
    },
    {
      "name": "petal lengthX", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "petal length"},
      "range": [0, {"signal": "chartSize"}]
    },
    {
      "name": "petal widthX", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "petal width"},
      "range": [0, {"signal": "chartSize"}]
    },

    {
      "name": "sepal lengthY", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "sepal length"},
      "range": [{"signal": "chartSize"}, 0]
    },
    {
      "name": "sepal widthY", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "sepal width"},
      "range": [{"signal": "chartSize"}, 0]
    },
    {
      "name": "petal lengthY", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "petal length"},
      "range": [{"signal": "chartSize"}, 0]
    },
    {
      "name": "petal widthY", "zero": false, "nice": true,
      "domain": {"data": "iris", "field": "petal width"},
      "range": [{"signal": "chartSize"}, 0]
    }
  ],

  "axes": [
    {
      "orient": "left", "scale": "sepal lengthY", "minExtent": 25,
      "title": "sepal length", "tickCount": 5, "domain": false,
      "position": {"signal": "3 * chartStep"},
      "titleFontSize": 14, "labelFontSize": 14, "titleFont": "serif"
    },
    {
      "orient": "left", "scale": "sepal widthY", "minExtent": 25,
      "title": "sepal width", "tickCount": 5, "domain": false,
      "position": {"signal": "2 * chartStep"},
      "titleFontSize": 14, "labelFontSize": 14, "titleFont": "serif"
    },
    {
      "orient": "left", "scale": "petal widthY", "minExtent": 25,
      "title": "petal width", "tickCount": 5, "domain": false,
      "position": {"signal": "1 * chartStep"},
      "titleFontSize": 14, "labelFontSize": 14, "titleFont": "serif"
    },
    {
      "orient": "left", "scale": "petal lengthY", "minExtent": 25,
      "title": "petal length", "tickCount": 5, "domain": false,
      "titleFontSize": 14, "labelFontSize": 14, "titleFont": "serif"
    },
    {
      "orient": "bottom", "scale": "sepal lengthX",
      "title": "sepal length", "tickCount": 5, "domain": false,
      "offset": {"signal": "-chartPad"},
      "titleFontSize": 14, "labelFontSize": 14, "titleFont": "serif"
    },
    {
      "orient": "bottom", "scale": "sepal widthX",
      "title": "sepal width", "tickCount": 5, "domain": false,
      "offset": {"signal": "-chartPad"}, "position": {"signal": "1 * chartStep"},
      "titleFontSize": 14, "labelFontSize": 14, "titleFont": "serif"
    },
    {
      "orient": "bottom", "scale": "petal widthX",
      "title": "petal width", "tickCount": 5, "domain": false,
      "offset": {"signal": "-chartPad"}, "position": {"signal": "2 * chartStep"},
      "titleFontSize": 14, "labelFontSize": 14, "titleFont": "serif"
    },
    {
      "orient": "bottom", "scale": "petal lengthX",
      "title": "petal length", "tickCount": 5, "domain": false,
      "offset": {"signal": "-chartPad"}, "position": {"signal": "3 * chartStep"},
      "titleFontSize": 14, "labelFontSize": 14, "titleFont": "serif"
    }
  ],

  "legends": [
    {
      "titleFontSize": 24,
      "labelFontSize": 18,
      "fill": "color",
      "title": "Class",
      "offset": 0,
      "encode": {
        "symbols": {
          "update": {
            "fillOpacity": {"value": 0.5},
            "stroke": {"value": "transparent"}
          }
        }
      }
    }
  ],

  "marks": [
    {
      "type": "rect",
      "encode": {
        "enter": {
          "fill": {"value": "#eee"}
        },
        "update": {
          "opacity": {"signal": "cell ? 1 : 0"},
          "x": {"signal": "cell ? cell.x + brushX[0] : 0"},
          "x2": {"signal": "cell ? cell.x + brushX[1] : 0"},
          "y": {"signal": "cell ? cell.y + brushY[0] : 0"},
          "y2": {"signal": "cell ? cell.y + brushY[1] : 0"}
        }
      }
    },
    {
      "name": "cell",
      "type": "group",
      "from": {"data": "cross"},

      "encode": {
        "enter": {
          "x": {"scale": "groupx", "field": "x.data"},
          "y": {"scale": "groupy", "field": "y.data"},
          "width": {"signal": "chartSize"},
          "height": {"signal": "chartSize"},
          "fill": {"value": "transparent"},
          "stroke": {"value": "#ddd"}
        }
      },

      "marks": [
        {
          "type": "symbol",
          "from": {"data": "iris"},
          "interactive": false,
          "encode": {
            "enter": {
              "x": {
                "scale": {"parent": "xscale"},
                "field": {"datum": {"parent": "x.data"}}
              },
              "y": {
                "scale": {"parent": "yscale"},
                "field": {"datum": {"parent": "y.data"}}
              },
              "fillOpacity": {"value": 0.5},
              "size": {"value": 36}
            },
            "update": {
              "fill": [
                {
                  "test": "!cell || inrange(datum[cell.datum.x.data], rangeX) && inrange(datum[cell.datum.y.data], rangeY)",
                  "scale": "color", "field": "class"
                },
                {"value": "#ddd"}
              ]
            }
          }
        }
      ]
    },
    {
      "type": "rect",
      "name": "brush",
      "encode": {
        "enter": {
          "fill": {"value": "transparent"}
        },
        "update": {
          "x": {"signal": "cell ? cell.x + brushX[0] : 0"},
          "x2": {"signal": "cell ? cell.x + brushX[1] : 0"},
          "y": {"signal": "cell ? cell.y + brushY[0] : 0"},
          "y2": {"signal": "cell ? cell.y + brushY[1] : 0"}
        }
      }
    }
  ]
}

render(spec);