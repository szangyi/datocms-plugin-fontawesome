import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import get from "lodash/get";
import { FC, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import * as faBrands from "@fortawesome/free-brands-svg-icons";
import * as faLight from "@fortawesome/pro-light-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { iconsBrands } from "../icons/iconsBrands";
import { iconsLight } from "../icons/iconsLight";

import { Canvas, TextInput } from "datocms-react-ui";
import "./styles.css";

type Props = {
  ctx: RenderFieldExtensionCtx;
};

const FontAwesomePicker: FC<Props> = ({ ctx }) => {
  const initialValue = get(ctx?.formValues, ctx?.fieldPath || "");
  const [showIcons, setShowIcons] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState(
    typeof initialValue === "string" ? JSON.parse(initialValue) : null
  );

  const handleIconClick = (icon: FontAwesomeIconProps) => {
    setSelectedIcon(icon);
    ctx?.setFieldValue(ctx.fieldPath, icon ? JSON.stringify(icon) : "");
  };

  const allIcons = [...iconsBrands, ...iconsLight]
    .filter((icon) => {
      if (searchTerm) {
        return icon.name.indexOf(searchTerm.toLowerCase()) !== -1;
      } else {
        return icon;
      }
    })
    .sort((a, b) => {
      const aName = `${a.name}${a.prefix}`;
      const bName = `${b.name}${b.prefix}`;

      if (aName > bName) {
        return 1;
      } else if (aName < bName) {
        return -1;
      }
      return 0;
    });

  const getReactIconName = (icon: { prefix: string; name: string }) => {
    let iconNameSpaces = icon?.name?.replace("-", " ") || "";
    while (iconNameSpaces.indexOf("-") !== -1) {
      iconNameSpaces = iconNameSpaces.replace("-", " ");
    }
    const iconNameSplit = iconNameSpaces.split(" ");
    let reactIconName = "";
    iconNameSplit.forEach((str: string) => {
      reactIconName = `${reactIconName}${str[0].toUpperCase()}${str.substr(1)}`;
    });
    return reactIconName;
  };

  const pageSize = 30;
  const workingIcons = [...allIcons].slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize
  );
  const totalPages = Math.ceil(allIcons.length / pageSize);

  return (
    <Canvas ctx={ctx}>
      <div className="App">
        {!selectedIcon && (
          <>
            <div>
              <span className="toggler" onClick={() => setShowIcons((s) => !s)}>
                {showIcons ? "Hide" : "Show"} all icons
              </span>
            </div>
            {!!showIcons && (
              <div className="search-input-wrapper">
                <TextInput
                  value={searchTerm}
                  onChange={(newValue) => {
                    setCurrentPage(1);
                    setSearchTerm(newValue);
                  }}
                  placeholder="Search..."
                  type="search"
                />
              </div>
            )}
          </>
        )}
        {!!selectedIcon && (
          <div
            className="selected-icon"
            key={`${selectedIcon.prefix}${selectedIcon.iconName}`}
          >
            <div>
              <FontAwesomeIcon icon={selectedIcon} />
            </div>
            <span>{selectedIcon.iconName}</span>
            <div
              onClick={() => {
                ctx?.setFieldValue(ctx.fieldPath, null);
                setSelectedIcon(null);
              }}
              className="remove-text"
            >
              Remove
            </div>
          </div>
        )}
        <div className="grid">
          {!selectedIcon &&
            !!showIcons &&
            workingIcons.map((icon) => {
              const reactIconName = getReactIconName(icon);
              let importFrom: any;
              switch (icon.prefix) {
                case "fab":
                  importFrom = faBrands;
                  break;
                case "fal":
                  importFrom = faLight;
                  break;
                default:
                  break;
              }

              return (
                <div
                  onClick={() =>
                    handleIconClick({
                      ...importFrom[`fa${reactIconName}`],
                    })
                  }
                  className="icon"
                  key={`${icon.prefix}${icon.name}`}
                >
                  <div>
                    <FontAwesomeIcon icon={importFrom[`fa${reactIconName}`]} />
                  </div>
                  <span>{icon.name}</span>
                </div>
              );
            })}
        </div>
        {!workingIcons.length && <h3>No icons found.</h3>}
        {!selectedIcon && !!showIcons && !!workingIcons.length && (
          <div className="pagination">
            <div>
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <div className="pages">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <FontAwesomeIcon icon={faLight.faChevronsLeft as IconProp} />
                </button>
                <button
                  onClick={() => setCurrentPage((s) => s - 1)}
                  disabled={currentPage === 1}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <FontAwesomeIcon icon={faLight.faChevronLeft as IconProp} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((s) => s + 1)}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <FontAwesomeIcon icon={faLight.faChevronRight as IconProp} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <FontAwesomeIcon icon={faLight.faChevronsRight as IconProp} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Canvas>
  );
};

export default FontAwesomePicker;
