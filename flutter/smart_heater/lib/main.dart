// Copyright 2018 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import 'package:flutter/material.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:syncfusion_flutter_gauges/gauges.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Heater',
      home: SmartDashboard(),
    );
  }
}

/**
 *  Class which contains most of the logic
 */
class SmartDashboardState extends State<SmartDashboard> {
 var _maxTempValue = 30.0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Smart Heater'),
      ),
      body: Column(
        children: [
          titleSection(),
          maxTempSlider(),
          tempChart(),
        ],
      ),
    );
  }

  Widget titleSection() {
    return Center(
      child: Container(
        padding: const EdgeInsets.all(26.0),
        child: Text(
          'Set maximum temperature',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget maxTempSlider() {
    double maxVar = _maxTempValue.toDouble();
  
    return SliderTheme(
      data: SliderTheme.of(context).copyWith(
        activeTrackColor: Colors.red[700],
        inactiveTrackColor: Colors.red[100],
        trackShape: RoundedRectSliderTrackShape(),
        trackHeight: 4.0,
        thumbShape: RoundSliderThumbShape(enabledThumbRadius: 12.0),
        thumbColor: Colors.redAccent,
        overlayColor: Colors.red.withAlpha(32),
        overlayShape: RoundSliderOverlayShape(overlayRadius: 28.0),
        tickMarkShape: RoundSliderTickMarkShape(),
        activeTickMarkColor: Colors.red[700],
        inactiveTickMarkColor: Colors.red[100],
        valueIndicatorShape: PaddleSliderValueIndicatorShape(),
        valueIndicatorColor: Colors.redAccent,
        valueIndicatorTextStyle: TextStyle(
          color: Colors.white,
        ),
      ),
      child: Slider(
        value: _maxTempValue,
        min: 0,
        max: 50,
        divisions: 50,
        label: '$_maxTempValue',
        onChanged: (value) {
          setState(
            () {
              _maxTempValue = value;
            },
          );
        },
      ),
    );
  }

  Widget tempChart() {
    var tempVal = 10.3;
    return SfRadialGauge(
        enableLoadingAnimation: true,
        animationDuration: 4500,
        title: GaugeTitle(
            text: 'House Temperature',
            textStyle:
                const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold)),
        axes: <RadialAxis>[
          RadialAxis(minimum: 0, maximum: 50, ranges: <GaugeRange>[
            GaugeRange(
                startValue: 0,
                endValue: _maxTempValue ,
                color: Colors.green,
                startWidth: 10,
                endWidth: 10),
            GaugeRange(
                startValue: _maxTempValue,
                endValue: 50,
                color: Colors.red,
                startWidth: 10,
                endWidth: 10)
          ], pointers: <GaugePointer>[
            NeedlePointer(value: tempVal, enableAnimation: true),
          ], annotations: <GaugeAnnotation>[
            GaugeAnnotation(
                widget: Container(
                    child: Text('${tempVal}',
                        style: TextStyle(
                            fontSize: 25, fontWeight: FontWeight.bold))),
                angle: 90,
                positionFactor: 0.5)
          ]),
        ]);
  }


  Widget _buildDashboard() {
    return Column();
  }
}

/**
 * Class to generate state for RandomWordsState
 */
class SmartDashboard extends StatefulWidget {
  @override
  SmartDashboardState createState() => SmartDashboardState();
}
