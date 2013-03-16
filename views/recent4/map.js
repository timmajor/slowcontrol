function(doc) {
  if (doc.timestamp && (doc.ios == 4)) {
      emit(doc.timestamp,doc) 
  }
};
