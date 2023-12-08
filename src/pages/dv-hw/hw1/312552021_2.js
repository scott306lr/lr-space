const {
  dispatch
} = d3;

export const menu = () => {
  let id;
  let labelText = "";
  let options = [];
  let selected;
  const listeners = dispatch('change');

  const my = (selection) => {
    selection
      .selectAll('label')
      .data([null])
      .join('label')
      .attr('for', id)
      .text(labelText);

    // selection with default to sepal length
    const dropdown = selection
      .selectAll('select')
      .data([null])
      .join('select')
      .attr('name', id)
      .attr('id', id)
      .on('change', (event) => {
        selected = event.target.value;
        listeners.call('change', null, selected);
      })
      .selectAll('option')
      .data(options)
      .join('option')
      .attr('value', (d) => d.value)
      .text((d) => d.label);

      dropdown.property("selected", d => d.value === selected)
  }

  

  my.id = function (_) {
    return arguments.length
      ? ((id = _), my)
      : id;
  };

  my.labelText = function (_) {
    return arguments.length
      ? ((labelText = _), my)
      : labelText;
  };

  my.options = function (_) {
    return arguments.length
      ? ((options = _), my)
      : options;
  };

  my.selected = function (_) {
    return arguments.length
      ? ((selected = _), my)
      : selected;
  };

  my.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? my : value;
  };
  
  return my;
};

