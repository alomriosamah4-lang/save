cmake_minimum_required(VERSION 3.4.1)

add_library( crypto_bridge SHARED
             crypto_bridge.cpp )

find_library( log-lib
              log )

target_link_libraries( crypto_bridge
                       ${log-lib} )

include(ExternalProject)

# Options to control building/downloading third-party libraries
option(BUILD_LIBSODIUM "Download and build libsodium" ON)
option(BUILD_ARGON2 "Download and build argon2" ON)

set(VENDOR_DIR ${CMAKE_SOURCE_DIR}/vendor)

if(BUILD_LIBSODIUM)
    if(EXISTS ${VENDOR_DIR}/libsodium/CMakeLists.txt)
        add_subdirectory(${VENDOR_DIR}/libsodium ${CMAKE_BINARY_DIR}/libsodium-build)
        target_link_libraries(crypto_bridge PUBLIC sodium)
        target_compile_definitions(crypto_bridge PRIVATE HAVE_SODIUM=1)
    else()
        # ExternalProject: fetch and build libsodium at configure time
        ExternalProject_Add(libsodium_ep
            GIT_REPOSITORY https://github.com/jedisct1/libsodium.git
            GIT_TAG stable
            PREFIX ${CMAKE_BINARY_DIR}/libsodium-ep
            CMAKE_ARGS -DCMAKE_INSTALL_PREFIX=<INSTALL_DIR> -DCMAKE_POSITION_INDEPENDENT_CODE=ON
            UPDATE_COMMAND ""
        )
        ExternalProject_Get_Property(libsodium_ep install_dir)
        set(LIBSODIUM_INSTALL_DIR ${install_dir})
        add_library(sodium STATIC IMPORTED)
        set_target_properties(sodium PROPERTIES IMPORTED_LOCATION ${LIBSODIUM_INSTALL_DIR}/lib/libsodium.a)
        add_dependencies(sodium libsodium_ep)
        target_link_libraries(crypto_bridge PUBLIC sodium)
        target_compile_definitions(crypto_bridge PRIVATE HAVE_SODIUM=1)
    endif()
endif()

if(BUILD_ARGON2)
    if(EXISTS ${VENDOR_DIR}/argon2/CMakeLists.txt)
        add_subdirectory(${VENDOR_DIR}/argon2 ${CMAKE_BINARY_DIR}/argon2-build)
        target_link_libraries(crypto_bridge PUBLIC argon2)
        target_compile_definitions(crypto_bridge PRIVATE HAVE_ARGON2=1)
    else()
        ExternalProject_Add(argon2_ep
            GIT_REPOSITORY https://github.com/P-H-C/phc-winner-argon2.git
            GIT_TAG master
            PREFIX ${CMAKE_BINARY_DIR}/argon2-ep
            CMAKE_ARGS -DCMAKE_INSTALL_PREFIX=<INSTALL_DIR> -DBUILD_SHARED_LIBS=OFF -DCMAKE_POSITION_INDEPENDENT_CODE=ON
            UPDATE_COMMAND ""
        )
        ExternalProject_Get_Property(argon2_ep install_dir)
        set(ARGON2_INSTALL_DIR ${install_dir})
        add_library(argon2 STATIC IMPORTED)
        set_target_properties(argon2 PROPERTIES IMPORTED_LOCATION ${ARGON2_INSTALL_DIR}/lib/libargon2.a)
        add_dependencies(argon2 argon2_ep)
        target_link_libraries(crypto_bridge PUBLIC argon2)
        target_compile_definitions(crypto_bridge PRIVATE HAVE_ARGON2=1)
    endif()
endif()

# Provide option to build native tests
add_library( crypto_tests STATIC
             )
