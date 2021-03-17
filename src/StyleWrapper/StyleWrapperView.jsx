import React from 'react';
import cx from 'classnames';
import config from '@plone/volto/registry';

export function getInlineStyles(data) {
  return {
    ...(data.backgroundColor ? { backgroundColor: data.backgroundColor } : {}),
    ...(data.textColor ? { color: data.textColor } : {}),
    ...(data.textAlign ? { textAlign: data.textAlign } : {}),
    ...(data.fontSize ? { fontSize: data.fontSize } : {}),
    // fill in more
  };
}

export function getStyle(name) {
  const { pluggableStyles = [] } = config.settings;
  return pluggableStyles.find(({ id }) => id === name);
}

const StyleWrapperView = (props) => {
  const { styleData = {}, data = {}, mode = 'view' } = props;
  const {
    style_name,
    align,
    size,
    customClass,
    customId,
    isDropCap,
  } = styleData;
  const containerType = data['@type'];

  const style = getStyle(style_name);
  const inlineStyles = getInlineStyles(styleData);
  const styled =
    Object.keys(inlineStyles).length > 0 ||
    style ||
    align ||
    size ||
    customClass ||
    isDropCap ||
    customId;

  const attrs = {
    style: inlineStyles,
    className: cx(style?.cssClass, customClass, align, {
      align,
      styled,
      'full-width': align === 'full',
      large: size === 'l',
      medium: size === 'm',
      small: size === 's',
      'drop-cap': isDropCap,
    }),
    id: customId,
  };

  const nativeIntegration =
    mode === 'view' &&
    config.settings.integratesBlockStyles.includes(containerType);

  const children = nativeIntegration
    ? React.Children.map(props.children, (child) => {
        const childProps = { ...props, styling: attrs };
        if (React.isValidElement(child)) {
          return React.cloneElement(child, childProps);
        }
        return child;
      })
    : props.children;

  const ViewComponentWrapper = style?.viewComponent;

  return styled ? (
    nativeIntegration ? (
      children
    ) : (
      <div {...attrs}>
        {ViewComponentWrapper ? <ViewComponentWrapper {...props} /> : children}
      </div>
    )
  ) : ViewComponentWrapper ? (
    <ViewComponentWrapper {...props} />
  ) : (
    children
  );
};

export default StyleWrapperView;
