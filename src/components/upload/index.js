import GzUploadTag from "./upload-tag.vue";
import GzUploadImageGroup from "./upload-image-group.vue";
import GzUploadImageCard from "./upload-image-card.vue";
import GzUploadList from "./upload-list.vue";

export default {
  name: "GzUpload",
  functional: true,
  props: {
    type: { type: String, default: "" },
  },
  render(h, context) {
    let { type } = (context && context.props) || {};
    let comp;
    if (type === "tag") {
      comp = GzUploadTag;
    } else if (type === "image-group") {
      comp = GzUploadImageGroup;
    } else if (type === "image-card") {
      comp = GzUploadImageCard;
    } else {
      comp = GzUploadList;
    }
    return h(comp, context);
  },
};
