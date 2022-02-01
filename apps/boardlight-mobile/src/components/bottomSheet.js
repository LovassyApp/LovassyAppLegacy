// From https://github.com/kcotias/react-native-gesture-bottom-sheet slightly modified

import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Component } from "react";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  background: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    width: "100%",
    height: 0,
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  draggableContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  draggableIcon: {
    width: 40,
    height: 6,
    borderRadius: 3,
    margin: 10,
    marginBottom: 0,
  },
});

class BottomSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      pan: new Animated.ValueXY(),
    };

    this.createPanResponder(props);
  }

  setModalVisible(visible) {
    const { closeFunction, height } = this.props;
    const { animatedHeight, pan } = this.state;
    if (visible) {
      this.setState({ modalVisible: visible });
      Animated.timing(animatedHeight, {
        toValue: height,
        duration: 250,
        useNativeDriver: false,
        easing: Easing.in(Easing.ease),
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
        easing: Easing.in(Easing.ease),
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        this.setState({
          modalVisible: visible,
          animatedHeight: new Animated.Value(0),
        });
        if (typeof closeFunction === "function") closeFunction();
      });
    }
  }

  createPanResponder(props) {
    const { height } = props;
    const { pan } = this.state;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          Animated.event([null, { dy: pan.y }], {
            useNativeDriver: false,
          })(e, gestureState);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const gestureLimitArea = height / 3;
        const gestureDistance = gestureState.dy;
        if (gestureDistance > gestureLimitArea) {
          this.setModalVisible(false);
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    });
  }

  show() {
    this.setModalVisible(true);
  }

  close() {
    this.setModalVisible(false);
  }

  render() {
    const {
      children,
      hasDraggableIcon,
      backgroundColor,
      sheetBackgroundColor,
      dragIconColor,
      dragIconStyle,
      draggable = true,
      onRequestClose,
      onClose = () => this.close(),
      radius,
    } = this.props;
    const { animatedHeight, pan, modalVisible } = this.state;
    const panStyle = {
      transform: pan.getTranslateTransform(),
    };

    return (
      <Modal transparent={true} visible={modalVisible} onRequestClose={onRequestClose}>
        <View style={[styles.wrapper, { backgroundColor: backgroundColor || "#25252599" }]}>
          <TouchableOpacity style={styles.background} activeOpacity={1} onPress={onClose} />
          <Animated.View
            {...(draggable && this.panResponder.panHandlers)}
            style={[
              panStyle,
              styles.container,
              {
                height: animatedHeight,
                borderTopRightRadius: radius || 10,
                borderTopLeftRadius: radius || 10,
                backgroundColor: sheetBackgroundColor || "#F3F3F3",
              },
            ]}>
            {hasDraggableIcon && (
              <View style={styles.draggableContainer}>
                <View
                  style={[
                    styles.draggableIcon,
                    dragIconStyle,
                    {
                      backgroundColor: dragIconColor || "#A3A3A3",
                    },
                  ]}
                />
              </View>
            )}
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

export default BottomSheet;
