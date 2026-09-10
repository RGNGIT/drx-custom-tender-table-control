import React, { useState, useId, useLayoutEffect, useEffect } from 'react';
import { IBaseInputModel, IBaseInputProps } from './base-input.model';
import './base-input.css';
import { Theme } from '@directum/sungero-remote-component-types';

const BaseInput = (props: IBaseInputProps) => {
  const [value, setValue] = useState<string>(props.value || '');

  const uniqueId = `input${useId()}`;
  const entity = props.api.getEntity() as IBaseInputModel;
  const isNightTheme = props.context.theme === Theme.Night;

  useLayoutEffect(() => {
    let localContainer = entity[props.customPropertyContainer];
    let directumProperties = JSON.parse(localContainer);

    if (directumProperties && directumProperties[props.propertyName])
      setValue(directumProperties[props.propertyName]);
  }, []);

  useEffect(() => {
    if (isNightTheme) {
      document.body.classList.add('night-theme');
    } else {
      document.body.classList.remove('night-theme');
    }
  }, [isNightTheme]);

  const onChange = (newValue: string): void => {
    let localContainer = entity[props.customPropertyContainer] || '{}';
    const directumProperties = JSON.parse(localContainer);
    directumProperties[props.propertyName] = newValue;

    entity.changeProperty(props.customPropertyContainer, JSON.stringify(directumProperties));
    setValue(newValue);
  };

  return (
    <div className="base-input">
      <label htmlFor={uniqueId}>
        {props.label || ''}
      </label>
      <div className="input-wrapper">
        <div className="border" />
        <div className="border-active" />
        <input
          type="text"
          id={uniqueId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

export default BaseInput;