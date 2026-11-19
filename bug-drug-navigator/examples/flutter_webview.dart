// Hulool mobile (Flutter).
// pubspec.yaml:
//   dependencies:
//     webview_flutter: ^4.0.0
//   flutter:
//     assets:
//       - assets/spectra/
//       - assets/spectra/css/
//       - assets/spectra/js/
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class SpectraPage extends StatefulWidget {
  const SpectraPage({super.key, required this.staffCode, required this.role, required this.onEvent});
  final String staffCode;
  final String role;
  final void Function(Map<String, dynamic> event) onEvent; // batch + POST to Hulool with the app's auth
  @override
  State<SpectraPage> createState() => _SpectraPageState();
}

class _SpectraPageState extends State<SpectraPage> {
  late final WebViewController _c = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..addJavaScriptChannel('SpectraChannel', onMessageReceived: (msg) {
      final m = jsonDecode(msg.message) as Map<String, dynamic>;
      if (m['source'] == 'spectra' && m['type'] == 'event') {
        widget.onEvent(Map<String, dynamic>.from(m['event'] as Map));
      }
    })
    ..setNavigationDelegate(NavigationDelegate(onPageFinished: (_) {
      _c.runJavaScript('Spectra.analytics.setUser(${jsonEncode(widget.staffCode)}, '
          '{role: ${jsonEncode(widget.role)}, site: "HGH"});');
    }))
    ..loadFlutterAsset('assets/spectra/index.html');

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Spectra')),
        body: WebViewWidget(controller: _c),
      );
}
// Usage panel: _c.runJavaScript('Spectra.analytics.openPanel();');
// Content editor — SYSTEM ADMINISTRATORS ONLY (after Hulool login confirms the role; the server enforces it on publish):
//   if (session.role == 'sysadmin') _c.runJavaScript('Spectra.admin.grant(${jsonEncode({"role": "sysadmin", "user": session.staffCode, "token": session.token})});');
