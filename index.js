import {
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from "react-native";

import PropTypes from "prop-types";
import React from "react";
import { getLinkPreview } from "link-preview-js";

const REGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;

export default class RNUrlPreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUri: false,
      linkTitle: undefined,
      linkDesc: undefined,
      linkFavicon: undefined,
      linkImg: undefined
    };
    this.getPreview(props.text);
  }

  getPreview = text => {
    getLinkPreview(text)
      .then(data => {
        this.setState({
          isUri: true,
          linkTitle: data.title ? data.title : undefined,
          linkDesc: data.description ? data.description : undefined,
          linkImg: this.props.thumbnailURL
            ? undefined
            : data.images && data.images.length > 0
            ? data.images.find(function(element) {
                return (
                  element.includes(".png") ||
                  element.includes(".jpg") ||
                  element.includes(".jpeg")
                );
              })
            : undefined,
          linkFavicon: this.props.thumbnailURL
            ? undefined
            : data.favicons && data.favicons.length > 0
            ? data.favicons[data.favicons.length - 1]
            : undefined
        });
      })
      .catch(error => {
        this.setState({ isUri: false });
        console.log("LinkPreview error : ", error);
      });
  };

  componentDidUpdate() {
    if (this.props.text !== null) {
      this.getPreview(this.props.text);
    } else {
      this.setState({ isUri: false });
    }
  }

  _onLinkPressed = () => {
    Linking.openURL(this.props.text.match(REGEX)[0]);
  };

  renderImage = (
    imageLink,
    faviconLink,
    imageStyle,
    faviconStyle,
    imageProps,
    thumbnailURL
  ) => {
    if (!!thumbnailURL) {
      if (thumbnailURL.startsWith("favicon_")) {
        return (
          <Image
            style={faviconStyle}
            source={{ uri: thumbnailURL.slice(8) }}
            {...imageProps}
          />
        );
      } else {
        return (
          <Image
            style={imageStyle}
            source={{ uri: thumbnailURL }}
            {...imageProps}
          />
        );
      }
    }
    return imageLink ? (
      <Image style={imageStyle} source={{ uri: imageLink }} {...imageProps} />
    ) : faviconLink ? (
      <Image
        style={faviconStyle}
        source={{ uri: faviconLink }}
        {...imageProps}
      />
    ) : null;
  };
  renderText = (
    showTitle,
    title,
    description,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines
  ) => {
    return (
      <View style={textContainerStyle}>
        {showTitle && (
          <Text numberOfLines={titleNumberOfLines} style={titleStyle}>
            {title}
          </Text>
        )}
        {description && (
          <Text
            numberOfLines={descriptionNumberOfLines}
            style={descriptionStyle}
          >
            {description}
          </Text>
        )}
      </View>
    );
  };
  renderLinkPreview = (
    text,
    containerStyle,
    imageLink,
    faviconLink,
    imageStyle,
    faviconStyle,
    showTitle,
    title,
    description,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines,
    imageProps,
    getImageLink,
    thumbnailURL
  ) => {
    if (!!imageLink) {
      getImageLink(imageLink);
    } else if (!imageLink && !!faviconLink) {
      getImageLink(`favicon_${faviconLink}`);
    }
    return (
      <TouchableOpacity
        style={[styles.containerStyle, containerStyle]}
        activeOpacity={0.9}
        onPress={() => this._onLinkPressed()}
      >
        {this.renderImage(
          imageLink,
          faviconLink,
          imageStyle,
          faviconStyle,
          imageProps,
          thumbnailURL
        )}
        {this.renderText(
          showTitle,
          title,
          description,
          textContainerStyle,
          titleStyle,
          descriptionStyle,
          titleNumberOfLines,
          descriptionNumberOfLines
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const {
      text,
      containerStyle,
      imageStyle,
      faviconStyle,
      textContainerStyle,
      title,
      titleStyle,
      titleNumberOfLines,
      descriptionStyle,
      descriptionNumberOfLines,
      imageProps,
      getImageLink,
      thumbnailURL
    } = this.props;
    return this.state.isUri
      ? this.renderLinkPreview(
          text,
          containerStyle,
          this.state.linkImg,
          this.state.linkFavicon,
          imageStyle,
          faviconStyle,
          title,
          this.state.linkTitle,
          this.state.linkDesc,
          textContainerStyle,
          titleStyle,
          descriptionStyle,
          titleNumberOfLines,
          descriptionNumberOfLines,
          imageProps,
          getImageLink,
          thumbnailURL
        )
      : null;
  }
}

const styles = {
  containerStyle: {
    flexDirection: "row"
  }
};

RNUrlPreview.defaultProps = {
  text: null,
  containerStyle: {
    backgroundColor: "rgba(239, 239, 244,0.62)",
    alignItems: "center"
  },
  imageStyle: {
    width: Platform.isPad ? normalize(160) : normalize(110),
    height: Platform.isPad ? normalize(160) : normalize(110),
    paddingRight: normalize(10),
    paddingLeft: normalize(10)
  },
  faviconStyle: {
    width: normalize(40),
    height: normalize(40),
    paddingRight: normalize(10),
    paddingLeft: normalize(10)
  },
  textContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: normalize(10)
  },
  title: true,
  titleStyle: {
    fontSize: normalize(12),
    color: "#000",
    marginRight: normalize(10),
    marginBottom: 5,
    alignSelf: "flex-start",
    fontFamily: "Helvetica"
  },
  titleNumberOfLines: 2,
  descriptionStyle: {
    fontSize: normalize(10),
    color: "#81848A",
    marginRight: normalize(10),
    alignSelf: "flex-start",
    fontFamily: "Helvetica"
  },
  descriptionNumberOfLines: Platform.isPad ? 4 : 3,
  imageProps: { resizeMode: "contain" },
  getImageLink: text => null
};

RNUrlPreview.propTypes = {
  text: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  imageStyle: ViewPropTypes.style,
  faviconStyle: ViewPropTypes.style,
  textContainerStyle: ViewPropTypes.style,
  title: PropTypes.bool,
  titleStyle: Text.propTypes.style,
  titleNumberOfLines: Text.propTypes.numberOfLines,
  descriptionStyle: Text.propTypes.style,
  descriptionNumberOfLines: Text.propTypes.numberOfLines,
  getImageLink: PropTypes.func,
  thumbnailURL: PropTypes.string
};
