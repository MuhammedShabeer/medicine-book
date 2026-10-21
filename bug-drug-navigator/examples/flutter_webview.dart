// pubspec.yaml:
//   dependencies:
//     webview_flutter: ^4.0.0
//   flutter:
//     assets:
//       - assets/bug-drug-navigator/
//       - assets/bug-drug-navigator/css/
//       - assets/bug-drug-navigator/js/
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class BugDrugNavigatorPage extends StatefulWidget {
  const BugDrugNavigatorPage({super.key});
  @override
  State<BugDrugNavigatorPage> createState() => _BugDrugNavigatorPageState();
}

class _BugDrugNavigatorPageState extends State<BugDrugNavigatorPage> {
  late final WebViewController _controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..loadFlutterAsset('assets/bug-drug-navigator/index.html');

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Bug–Drug Navigator')),
        body: WebViewWidget(controller: _controller),
      );
}
